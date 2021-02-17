<template>
  <div class="container news_infos" style="background-color:rgba(255,255,255,0)">

    <!--文章目录 -->
    <div class="contentMenu" v-if="router.length !== 0">
      <strong>文章目录</strong>
      <Menu :router="router"></Menu>
    </div>
    <!--目录弹出窗-->
    <transition name="cartoonMenu">
      <div class="dialogMenu" v-show="menuShow && router.length !== 0">
        <strong>文章目录</strong>
        <Menu :router="router"></Menu>
      </div>
    </transition>
    <!--目录按钮-->
    <div class="menuButton" v-show="router.length !== 0" @click="menuButton">
      <strong style="cursor: pointer;color: #fff9ec;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;">☰</strong>
    </div>

    <!--文章标题-->
    <h3 class="text-center">{{ article.title }}</h3>
    <!--文章信息-->
    <p>&nbsp;&nbsp;&nbsp;&nbsp;作者: <strong style="color: #9fcdff"> {{ art_user.username }} </strong>  最近编辑于:{{ article.create_time | formatDate("yyyy-MM-dd hh:mm:ss") }}  类型:<strong style="color: #9fcdff"> <router-link :to="{ name: 'typeArticle', query:{ type:article.type_id,page:1,searchValue:'' } }">{{ articleTypeName }}</router-link></strong></p>
    <HR></HR>
    <!--文章内容-->
    <div class="gallerys" style="background-color:rgba(255,255,255,0)" v-html="article.detail">

    </div>
    <br>

    <div :id="article['id']" class="row" style="background-color:rgba(255,255,255,0)">

      <el-col :span="24">
        <el-form :model="commentForm" ref="commentForm" label-width="0px" class="demo-dynamic">
          <el-form-item>
            <el-button type="success" plain @click="commentButton(Date.now())">评论({{ commentListSize }})</el-button>
          </el-form-item>
          <!--输入框-->
          <el-form-item
            v-for="(input, index) in commentForm.inputs"
            :key="input.key"
          >
            <!--输入框-->
            <el-input type="textarea" v-model="input.value"></el-input>
            <!--发表按钮-->
            <el-button type="primary" plain @click.prevent="commentSub(input)">发表</el-button>
            <!--取消按钮-->
            <el-button @click="canCelComment(input)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <br><br>

    <!--评论区-->
    <template v-if="!(commentListSize===0)">
      <template v-for="(lists,i) in commAndReplyList">
        <!--评论-->
        <div style="background-color:rgba(255,255,255,0)">
          <p><strong :name="lists['co']['id']" style="color: #9fcdff">{{ lists['co_username'] }}</strong>说:<br>&nbsp;&nbsp;&nbsp;&nbsp;{{ lists['co']['detail'] }}&nbsp;&nbsp;&nbsp;&nbsp;{{ lists['co']['create_time'] | formatDate("yyyy-MM-dd hh:mm:ss") }}

              <el-form :model="replyForm" ref="replyForm" label-width="0px" class="demo-dynamic">
                <el-form-item>
                  <!--依次为评论id，回复id(由于此回复按钮上面没有回复，此回复按钮回复的对象是评论，所以设置为-1，使用-1和评论id确定这唯一的回复按钮)-->
                  <el-button
                    @click="replyButton( lists['co']['id'] + ',' + '-1' + ',' + lists['co_username'] + ',' + Date.now() )">
                    回复
                  </el-button>
                </el-form-item>

                <!--输入框-->
                <el-col :span="24">
                  <el-form-item
                    v-for="(input, index) in replyForm.inputs"
                    :key="input.key"
                  >
                    <templates v-if="input['reply_id'] == -1 && input['comment_id'] == lists['co']['id']">
                      <!--输入框-->
                      <el-input type="textarea" v-model="input.value"></el-input>
                      <!--发表按钮-->
                      <el-button type="primary" plain @click.prevent="replySub(input)">发表</el-button>
                      <!--取消按钮-->
                      <el-button @click="canCelReply(input)">取消</el-button>
                    </templates>
                  </el-form-item>
                </el-col>
              </el-form>
          </p>
        </div>

        <!--回复区-->
        <div class="replyarea container" style="background-color:rgba(255,255,255,0)">

          <!--遍历回复集-->
          <template v-if="!(lists['rep_lists'].length === 0)">
            <template v-for="(rep_lists,i) in lists['rep_lists']">
              <!--一条回复-->
              <p><strong :name="lists['co']['id']" style="color: #9fcdff">{{ rep_lists['re_username']}}</strong> {{ rep_lists['re']['detail'] }}&nbsp;&nbsp;&nbsp;&nbsp;{{ rep_lists['re']['create_time'] | formatDate("yyyy-MM-dd hh:mm:ss") }}


                  <el-form :model="replyForm" ref="replyForm" label-width="0px" class="demo-dynamic">
                    <el-form-item>
                      <!--lists['co']['id'] 为此条回复所在评论的id， rep_lists['re'] 为此条回复。 将此条回复id传到inputs里面，以便下面做判断，v-if来决定是否显示-->
                      <el-button
                        @click="replyButton( lists['co']['id'] + ',' + rep_lists['re']['id'] + ',' + rep_lists['re_username'] + ',' + Date.now() )">
                        回复
                      </el-button>
                    </el-form-item>
                    <!--输入框-->
                    <el-col :span="24">
                      <el-form-item
                        v-for="(input, index) in replyForm.inputs"
                        :key="input.key"
                      >
                        <!--输入框-->
                        <templates v-if="input['reply_id'] == rep_lists['re']['id'] && input['comment_id'] == lists['co']['id']">
                          <el-input type="textarea" v-model="input.value"></el-input>
                          <!--发表按钮-->
                          <el-button type="primary" plain @click.prevent="replySub(input)">发表</el-button>
                          <!--取消按钮-->
                          <el-button @click="canCelReply(input)">取消</el-button>
                        </templates>

                      </el-form-item>
                    </el-col>
                  </el-form>

              </p>
              <br>
            </template>
          </template>
        </div>
      </template>
    </template>
    <!--回到顶部-->
    <template>
      <el-backtop :bottom="100" :right="30">
        <div
          style="{
        height: 100%;
        width: 100%;
        color: #fff9ec;
        background-color: gray;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        border-radius: 4px;
      }"
        >
          ︿
        </div>
      </el-backtop>
    </template>
  </div>
</template>

<script>
    import * as jQuery from "../../assets/jquery-3.3.1.min"
    import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min";
    import { formatDate } from '../../common';

    /*谷歌代码高亮插件*/
    import prettify from "../../assets/google-code-prettify/prettify";
    $(document).ready(function(){
        prettyPrint();
    });

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name: 'articleRead',
        data: () => {
            return {
                menuShow: false, // 目录弹窗是否显示
                router: [], // 文章目录数据
                isOpenImg: false, // 文章图片是否被全屏
                commentForm: {
                    inputs: [{
                        value: '' // 文本框的值
                    }],
                },
                replyForm: {
                    inputs: [{
                        value: '' // 文本框的值
                    }]
                },

                // 评论按钮绑定消息框
                commentReference:true,
                'article':{
                    'id':0,
                    'create_time':'',
                    'is_delete':false,
                    'title':'',
                    'descriptive':'',
                    'is_secrete':false,
                    'detail':'',
                    'type_id':0,
                    'user_id':0,
                    'touch_num':0,
                },
                'art_user':{
                    'id':0,
                    'is_superuser':false,
                    'username':'',
                    'email':'',
                    'is_active':false,
                    'create_time':'',
                    'is_delete':false,
                },
                'articleTypeName':'',
                'commAndReplyList':[{
                    'co_username':'',
                    'co':{
                        'id':0,
                        'create_time':'',
                        'is_delete':false,
                        'detail':'',
                        'article_id':0,
                        'user_id':0,
                    } ,
                    'rep_lists':[{
                        're_username':'',
                        're':{
                            'id':0,
                            'create_time':'',
                            'is_delete':false,
                            'detail':'',
                            'comment_id':0,
                            'user_id':0,
                        }
                    }] ,
                }],
                'commentListSize':0,

            }
        },

        computed: {

        },

        watch: {
            $route(to,from){
                this.menuShow = false;
            }
        },

        created() {
            // 加载文章数据
            this.loadArticle();
        },

        mounted() {
            // 删除回复按钮表组
            this.replyForm.inputs.splice(0,this.replyForm.inputs.length);
            // 使用jq的on方法给“未来的”图片元素节点添加点击事件，因为此时dom还未更新，当然也可以使用vue的nextTick方法里直接监听
            $(document).on("click",'div.gallerys img',
                function(e){
                    let img = e.target;
                    if (this.isOpenImg) {
                        // 如果有全屏的标签，取消全屏
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExiFullscreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                        this.isOpenImg = false
                    } else {
                        // 给被点击的元素添加全屏
                        if (img.requestFullscreen) {
                            img.requestFullscreen();
                        } else if (img.webkitRequestFullScreen) {
                            img.webkitRequestFullScreen();
                        } else if (img.mozRequestFullScreen) {
                            img.mozRequestFullScreen();
                        } else {
                            img.msRequestFullscreen();
                        }
                        this.isOpenImg = true
                    }

                });

        },

        methods:{
            // 目录按钮
            menuButton() {
                this.menuShow = !this.menuShow;
            },
            // 发表评论
            commentSub(input) {
                var inputs = this.commentForm.inputs;
                // 判断登录状态
                if (this.getIsLogined() === false) {
                    this.open('提示~','您未登录，请登录后评论');
                    return;
                }
                // 获取输入框文本，获取当前文章id，发起评论请求
                var id = this.$route.query.id;
                if (inputs[0].value.length < 1 || inputs[0].value === undefined || id < 0 || id===null) {
                    // 如果已有输入框实例，删除的，重置
                    this.open('提示~','您的评论参数有误,请重试');
                }else {
                    // 发起评论请求
                    this.$http.post("/comment/commentWrite",{ id:id, detail:inputs[0].value
                    }).then(resp => {
                        // console.log(resp.data); // 返回的Response体
                        // console.log(resp.data.username);
                        if (resp.data.res == "ok") {
                            this.open("提示~",resp.data.msg);
                            // 刷新当前页面
                            this.reload();
                        } else if (resp.data.res == "no") {
                            this.open("提示~",resp.data.msg)
                        }else {
                            this.open('请求出错‘，’请稍后重试')
                        }
                    }).catch(error => {
                        if(error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            /*console.log("response-data: ", error.response.data);
                             console.log("response-statues: ", error.response.status);
                             console.log("response-headers: ", error.response.headers);*/
                            this.open('请求出错',error.response.data.message);
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
            // 取消评论
            canCelComment(input) {
                // 如果已有输入框实例，删除掉，重置
                if (this.commentForm.inputs.length > 0) {
                    this.commentForm.inputs.splice(0,this.commentForm.inputs.length);
                }
            },
            // 评论按钮
            commentButton(data) {
                // 如果已有输入框实例，删除掉，重置
                if (this.commentForm.inputs.length > 0) {
                    this.commentForm.inputs.splice(0,this.commentForm.inputs.length);
                }else {
                    // 增加评论输入框实例
                    this.commentForm.inputs.push({
                        value:'',
                        key:data,
                    })
                }
            },

            // 发表回复
            replySub() {
                // 判断登录状态
                var inputs = this.replyForm.inputs;
                if (this.getIsLogined() === false) {
                    this.open('提示~','您未登录，请登录后回复');
                    return;
                }
                // console.log(inputs[0].key);
                if (inputs[0].value.length < 1 || inputs[0].value === undefined) {
                    this.open('提示~','您输入的回复为空');
                }else {
                    // 准备数据，发起请求
                    var reply_detail = inputs[0].value;
                    var replyToName = inputs[0].replyed_name;
                    var reply_commentId = inputs[0].comment_id;
                    this.$http.post("/reply/replyWrite",{ reply_detail:reply_detail, replyToName:replyToName, reply_commentId:reply_commentId
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

            // 回复按钮
            replyButton(data) {
                var inputs = this.replyForm.inputs;
                // 如果已有输入框实例，删除掉，重置
                if (this.replyForm.inputs.length > 0) {
                    inputs.splice(0,this.replyForm.inputs.length);
                }else {
                    // 解析data，以,分割
                    var strings = data.split(',');
                    // 更新replyForm.inputs的数据
                    // 增加评论输入框实例
                    // console.log("strings: ",strings);
                    this.replyForm.inputs.push({
                        value:'',             // 输入框值，这个及下面都是双向绑定
                        key:strings[3],        // Date
                        comment_id: strings[0], // 所在评论id
                        reply_id: strings[1], // 回复id
                        replyed_name: strings[2],  //被回复者名称
                    })
                }

            },

            // 取消回复
            canCelReply() {
                // 如果已有输入框实例，删除掉，重置
                if (this.replyForm.inputs.length > 0) {
                    this.replyForm.inputs.splice(0,this.replyForm.inputs.length);
                }
            },

            // 获取父组件的属性，判断是否已登录
            getIsLogined() {
                return this.$parent.isLogined;
            },

            // element
            open(title,msg) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: 'warning'
                });
            },
            loadArticle() {
                // 获取当前路径的id
                // console.log(this.$route.query.page);
                this.$http.get("/article/articleRead/"+this.$route.query.id).then(resp => {
                    // console.log(resp.data); // 返回的Response体
                    // console.log(resp.data.username);

                    this.article = resp.data.article;
                    this.art_user = resp.data.art_user;
                    this.articleTypeName = resp.data.articleTypeName;
                    this.commAndReplyList = resp.data.commAndReplyList;
                    this.commentListSize = resp.data.commentListSize;

                    // 像父组件发送文章标题
                    this.$emit('sendArticleTitle',resp.data.article.title)

                    // 生成文章目录数据，使用nextTick方法，获取h标签，并且使用vue的set方法给data的目录数据增加属性
                    this.$nextTick(function () {
                        var obj = [];
                        var previousH = '';
                        $(".gallerys").children().each(function(index, element) {
                            var tagName=$(this).get(0).tagName;

                            if(tagName.toUpperCase()=="H1"){
                                previousH = 'H1';
                                var result = $(this).get(0).innerText;
                                var markid="mark-"+tagName+"-"+index.toString();
                                $(this).attr("id",markid);//为当前h标签设置id
                                obj.push({
                                    'href': '#' + markid,
                                    'title': result,
                                })
                            } else if (tagName.toUpperCase()=="H2") {
                                var result = $(this).get(0).innerText;
                                var markid="mark-"+tagName+"-"+index.toString();
                                $(this).attr("id",markid);//为当前h标签设置id
                                if (obj.length == 0) {
                                    obj.push({
                                        'href':'',
                                        'title':'',
                                        children:[{
                                            'href': '#' + markid,
                                            'title': result,
                                        }]
                                    })
                                } else {
                                    if (obj[obj.length-1].children == undefined) {
                                        obj[obj.length-1].children = [];
                                    }
                                    obj[obj.length-1].children.push({
                                        'href': '#' + markid,
                                        'title': result,
                                    })
                                }

                            } else if (tagName.toUpperCase()=="H3") {
                                var result = $(this).get(0).innerText;
                                var markid="mark-"+tagName+"-"+index.toString();
                                $(this).attr("id",markid);//为当前h标签设置id
                                if (obj.length == 0) {
                                    obj.push({
                                        'href':'',
                                        'title':'',
                                        'children':[{
                                            'href':'',
                                            'title':'',
                                            'children':[{
                                                'href': '#' + markid,
                                                'title': result,
                                            }]
                                        }]
                                    })
                                } else {
                                    if (obj[obj.length-1].children[obj[obj.length-1].children.length-1].children == undefined) {
                                        obj[obj.length-1].children[obj[obj.length-1].children.length-1].children = [];
                                    }
                                    obj[obj.length-1].children[obj[obj.length-1].children.length-1].children.push({
                                        'href': '#' + markid,
                                        'title': result,
                                    })
                                }
                            }

                        });
                        // Object.assign(this.router,obj);
                        obj.forEach((item,index,arr)=>{
                            this.$set(this.router,index,JSON.parse(JSON.stringify(item)))
                        })
                    })

                }).catch(error => {
                    this.open('出错了~','请稍后刷新重试');
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
<style>
  @import "../../assets/google-code-prettify/prettify.css";
  div.gallerys  img{
    max-width: 90%;
  }
  @media screen and (min-width: 1600px){
    .contentMenu{
      display: block;
      position: fixed;
      width: 222px;
      height: 400px;
      top: 20%;
      left: 2%;
      overflow: auto;
      text-overflow: ellipsis;
      border:1px solid #000;
      white-space: nowrap;
      box-shadow: 10px 10px 5px #888888;
      border-radius: 8px;

    }
    .menuButton{
      display: none;
    }
    .dialogMenu{
      display: none;
    }
  }
  @media screen and (max-width: 1600px) {
    .contentMenu{
        display: none;
    }
    .menuButton{
      padding: 12px 9px;
      border-radius: 4px;
      width: 30.3px;
      height: 44px;
      background-color: gray;
      position: fixed;
      right: 30px;
      top: 30%;
      cursor: pointer;

    }
    .dialogMenu{
      display: block;
      position: fixed;
      width: 222px;
      height: 400px;
      top: 20%;
      left: 2%;
      text-overflow: ellipsis;
      border:1px solid #000;
      background-color: white;
      overflow:auto;
      white-space: nowrap;
      border-radius: 8px;
      box-shadow: 10px 10px 5px #888888;
    }
  }
  @media screen and (max-width: 768px) {
    .menuButton{
      right: 0;
    }
  }
  .cartoonMenu-enter-active {
    animation: bounce-in .3s;
  }
  .cartoonMenu-leave-active {
    animation: bounce-in .3s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

</style>
