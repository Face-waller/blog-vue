<template>
  <div>
<!--    日志主体内容-->
    <div class="timebox container" style="background-color:rgba(255,255,255,0)">
      <ul>
          <li v-for="(p,i) in pageInfo.list">
            <span>
              {{ p.create_time | formatDate("yyyy-MM-dd") }}
            </span>
            <i>
              <a>
                <router-link target="_parent" :to="{ name:'articleRead',query:{ id:p.id } }">
                  {{ p.title }}
                </router-link>
              </a>
            </i>
          </li>
      </ul>
    </div>

<!--    页码-->
    <div class="text-center">
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-lg">

          <li><span>共 {{ pageInfo.pages }} 页 </span></li>

<!--          上一页-->
          <li v-if="pageInfo.hasPreviousPage">
            <router-link target="_parent" :to="{ name:'log', query:{ page: pageInfo.prePage } }">
              <a aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
              </a>
            </router-link>
          </li>
          <li class="disabled" v-else>
            <span href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </span>
          </li>

<!--          中间索引-->
          <template v-for="i in pageIter">
            <template v-if="i===pageInfo.pageNum">
              <li class="active">
                <router-link target="_parent" :to="{ name:'log', query:{ page: i} }">
                  <a>
                      {{i}}
                    <span class="sr-only">(current)</span>
                  </a>
                </router-link>
              </li>
            </template>
            <template v-else>
              <li>
                <router-link target="_parent" :to="{ name:'log', query:{ page: i } }">
                  <a>
                      {{i}}
                  </a>
                </router-link>
              </li>
            </template>
          </template>

<!--          下一页-->
          <li v-if="pageInfo.hasNextPage">
            <router-link target="_parent" :to="{ name:'log', query:{ page:pageInfo.nextPage } }">
              <a aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
              </a>
            </router-link>
          </li>
          <li class="disabled" v-else>
            <span href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </span>
          </li>

        </ul>
      </nav>
    </div>
  </div>

</template>

<script>
    import * as jQuery from "../../assets/jquery-3.3.1.min"
    import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min"
    import { formatDate } from '../../common'

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name: 'log',
        data: () => {
            return {
                pageIter:[],
                pageInfo:{
                    'serialVersionUID':0,
                    'pageNum':0,
                    'pageSize':0,
                    'size':0,
                    'startRow':0,
                    'endRow':0,
                    'total':0,
                    'pages':0,
                    'list':[{
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

                    }],
                    'prePage':0,
                    'nextPage':0,
                    'isFirstPage':false,
                    'isLastPage':false,
                    'hasPreviousPage':false,
                    'hasNextPage':false,
                    'navigatePages':0,
                    'navigatepageNums':[],
                    'navigateFirstPage':0,
                    'navigateLastPage':0,

                }
            }
        },

        computed: {

        },

        watch: {
            $route(to,from){
                this.reload();
            }

        },

        created() {

        },

        mounted() {
            this.logLoad();
        },

        methods:{
            // element
            open(title,msg) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: 'warning'
                });
            },
            logLoad() {
                // 获取当前路径的page
                // console.log(this.$route.query.page);
                this.$http.get("/common/log/"+this.$route.query.page).then(resp => {
                    // console.log(resp.data); // 返回的Response体
                    // console.log(resp.data.username);

                    this.pageIter = resp.data.pageIter;
                    this.pageInfo = resp.data.pageInfo;
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
                        this.open('加载失败','请稍后刷新重试');
                    }

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
<style type="text/css" scoped>
  .timebox { background: #FFF; padding: 30px }
  .timebox span { position: relative; line-height: 32px; padding-right: 40px; color: #999 }
  .timebox span:after { position: absolute; content: ""; width: 2px; height: 40px; background: #e0dfdf; right: 18px }
  .timebox li { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
  .timebox li i { position: relative; font-style: normal }
  .timebox li i:before { content: " "; height: 10px; width: 10px; border: 2px solid #cccaca; background: #fff; position: absolute; top: 4px; left: -26px; border-radius: 50%; -webkit-transition: all .5s ease; -moz-transition: all .5s ease; -ms-transition: all .5s ease; -o-transition: all .5s ease; transition: all .5s ease; }
  .timebox li:hover i:before { background: #333 }
</style>
