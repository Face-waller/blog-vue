<template>
  <div class="content whisper-content leacots-content">
    <div class="cont w1000">
      <div class="whisper-list">
        <div class="item-box">
          <div class="review-version">

              <div style="display: flex;justify-content: center;flex-wrap: wrap">
                <div style="width: 100%;margin-top: 50px;display: flex;justify-content: center;flex-wrap: wrap">
                  <el-input
                    ref="leaveTextArea"
                    style="width: 51%;margin: 30px 0 5px"
                    type="textarea"
                    rows="4"
                    resize="none"
                    placeholder="请输入内容"
                    v-model="detail">
                  </el-input>
                  <div style="width: 50%;display: flex;">
                    <div class="submit-button" @click.prevent="confirmSub">发表</div>
                  </div>
                </div>

                <div style="width: 50%;margin-top: 50px">
                  <div class="volume" v-if="!(leaveMessages === undefined)">
                    全部留言 <span>{{ leaveMessages.length }}</span>
                  </div>
                  <div class="volume" v-else>
                    全部留言 <span>0</span>
                  </div>
                  <br>
                  <div class="cont" style="margin-left: 0">
                    <div class="text" v-for="msg in leaveMessages">
                      <p class="tit"><span class="name" style="color: #9fcdff">{{ msg.userName }}</span></p>
                      <p class="ct">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ msg.detail }}   <span class="data">{{ msg.create_time | formatDate("yyyy-MM-dd hh:mm:ss") }}</span></p>
                    </div>
                  </div>
                </div>

              </div>



          </div>
        </div>
      </div>
      <div id="demo" style="text-align: center;"></div>
    </div>
  </div>
</template>

<script>
    import * as jQuery from "../../assets/jquery-3.3.1.min"
    import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min";
    import { formatDate } from '../../common'

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name: 'leaveMessage',
        data: () => {
            return {
                detail:'',
                leaveMessages:[{
                    id:0,
                    create_time:'',
                    is_delete:false,
                    detail:'',
                    userName:''
                }]

            }
        },
        computed: {

        },
        watch: {
          detail:{
              handler(newVal,objVal) {
                  if (this.$parent.isLogined === false) {
                      this.open("提示~","您未登录，请登录后留言");
                  }
              }
          }
        },
        created() {

        },
        mounted(){
          //加载数据
          this.loadDate();
          //聚焦输入框
            if ($(window).width() > 768) {
                this.$refs.leaveTextArea.focus();
            }
        },
        methods:{
            confirmSub() {
                // 判断参数，发起请求
                if (this.$parent.isLogined === false) {
                    this.open("提示~","您未登录，请登录后留言");
                    return;
                }
                if (this.detail === undefined || this.detail == "") {
                    this.open("提示~","请输入内容后确认")
                }else {
                    this.$http.post("/common/leaveMessage",{ detail:this.detail
                    }).then(resp => {
                        // console.log(resp.data); // 返回的Response体
                        // console.log(resp.data.username);
                        if (resp.data.res == "ok") {
                            this.open("提示~",resp.data.msg);
                            // 刷新当前页面
                            this.reload();
                        } else if (resp.data.res == "no") {
                            this.open("提示~",resp.data.msg)
                        } else {
                            this.open("请求出错","请稍后重试")
                        }
                    }).catch(error => {
                        if(error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            /*console.log("response-data: ", error.response.data);
                             console.log("response-statues: ", error.response.status);
                             console.log("response-headers: ", error.response.headers);*/
                            this.open('出错了~',error.response.data.message);
                        } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log("请求超时");
                            this.open('请求超时','请检查网络或客户端');
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            // console.log("error-config: ", error.config);
                            console.log("Error: ", error.message);
                            // this.errmsg = error.message;
                            this.open('请求出错‘，’请稍后重试')
                        }
                    });
                }
            },
            // 加载本页数据
            loadDate() {
                // 发起请求加载数据
                this.$http.get("/common/leaveMessage/get"
                ).then(resp => {
                    // console.log(resp.data); // 返回的Response体
                    // console.log(resp.data.username);
                    this.leaveMessages = resp.data.leaveMessages;
                }).catch(error => {
                    if(error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        /*console.log("response-data: ", error.response.data);
                         console.log("response-statues: ", error.response.status);
                         console.log("response-headers: ", error.response.headers);*/
                        this.open(' 提示~',error.response.data.message);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log("请求超时");
                        this.open('请求超时','请检查网络或客户端');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        // console.log("error-config: ", error.config);
                        console.log("Error: ", error.message);
                        // this.errmsg = error.message;
                        this.open('加载留言失败','请稍后刷新重试');
                    }

                });
            },
            // element
            open(title,msg) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: 'warning'
                });
            },

        },
        filters: {
            // 时间格式化过滤器
            formatDate(time,fm) {
                var date = new Date(time);
                return formatDate(date, fm);
            }
        },
    }
</script>

<style scoped>

  .submit-button {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 0;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #66afe9;
    transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    cursor: pointer;
  }
  .submit-button:hover {
    background-color: #9fcdff;
  }
</style>
