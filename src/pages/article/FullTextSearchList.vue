<template>
  <div class="box container" style="margin-top: 15px">
    <!--分类名称-->
    <div class="place col-sm-7 col-xs-12" id="pageContents" style="background-color:rgba(255,255,255,0)">

      <p style="color: #8c8c8c; font-size: large">分类 : 所有文章</p>

    </div>
    <!--搜索框-->
    <div class="col-sm-5 col-xs-7">
      <div class="input-group">
        <input type="text" ref="searchInput" @keyup.enter="searchEnter" class="form-control" placeholder="输入关键词" v-model="searchValue"/>
        <span class="input-group-addon" @click="searchIcoClick" ><i class="glyphicon glyphicon-search"></i></span>
      </div>
    </div>

    <!--以下内容根据类型按时间从大到小排序-->
    <div class="blogs">

      <div class="bloglist" style="background-color:rgba(255,255,255,0)">
        <template v-for="a in pageInfo.list">
          <h2>
            <a>
              <router-link :to="{ name:'articleRead', query:{ id:a.id } }">
                {{ a.title }}
              </router-link>
            </a>
          </h2>
          <p>{{ a.descriptive }}</p>
        </template>
      </div>

      <!--页码-->
      <div class="text-center">
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-lg">
            <li><span>共 {{ pageInfo.pages }} 页 </span></li>

            <!--上一页-->
                <li v-if="pageInfo.hasPreviousPage">
                  <router-link :to="{ name:'fullTextSearch', query:{ page:pageInfo.prePage, searchValue: searchValue } }">
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

            <!--中间索引-->
            <template v-for="pa in pageIter">
              <template v-if="pa === pageInfo.pageNum">
                <li class="active">
                  <router-link :to="{ name:'fullTextSearch', query:{ page:pa, searchValue:searchValue } }">
                    <a>
                        {{ pa }}
                      <span class="sr-only">(current)</span>
                    </a>
                  </router-link>
                </li>
              </template>
              <template v-else>
                <li>
                  <router-link :to="{ name:'fullTextSearch', query:{ page:pa, searchValue:searchValue } }">
                    <a>
                      {{ pa }}
                    </a>
                  </router-link>
                </li>
              </template>
            </template>

            <!--下一页-->
            <li v-if="pageInfo.hasNextPage">
              <router-link :to="{ name:'fullTextSearch', query:{ page:pageInfo.nextPage, searchValue:searchValue } }">
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
  </div>
</template>

<script>
    import * as jQuery from "../../assets/jquery-3.3.1.min"
    import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min"

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name: 'fullTextSearch',
        data(){
            return{
                articleType:{  // 文章类型对象
                    id:0,
                    create_time:"",
                    is_delete:false,
                    detail:""
                },
                searchValue:"", // 搜索值
                pageInfo:{    // 分页对象
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

                },
                pageIter:[], // 分页数集合
            }

        },
        watch: {
            searchValue:{
                handler(newVal, objVal) {
                    if (newVal.length < 1 ) {
                        // 跳转 类型文章列表界面
                        this.$router.push( {
                            name:"fullTextSearch",
                            query:{ page:"1", searchValue: " " }
                        } )
                    }
                }
            },
            $route(to, from){
                this.reload();
            }
        },
        methods: {
            // 跳转到搜索列表界面
            skipArticleList() {
                if (this.searchValue == null){
                    this.open("提示~","搜素内容为空");
                    return;
                }
                if (this.isNull(this.searchValue)){
                    this.open("提示~","搜素内容为空");
                    return;
                }
                // 跳转 类型文章列表界面
                this.$router.push( {
                    name:"fullTextSearch",
                    query:{ page:"1", searchValue: this.searchValue }
                } )
            },
            // 搜索图标点击事件
            searchIcoClick() {
                this.skipArticleList();
            },
            // 搜索按钮enter事件函数
            searchEnter() {
                this.skipArticleList();
            },
            // 字符串是否为空
            isNull( str ){
                if ( str === "" ) return true;
                var regu = "^[ ]+$";
                var re = new RegExp(regu);
                return re.test(str);
            },
            // element
            open(title,msg) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: 'warning'
                });
            },
            // 发送请求加载本组件数据
            loadData() {
                // 获取页数page和搜索值searchValue
                var searchValue = "";
                if (this.$route.query.searchValue === null
                    || this.$route.query.searchValue == ""
                    ||this.$route.query.searchValue === undefined) {
                    searchValue = ""
                } else {
                    searchValue = "/" + this.$route.query.searchValue
                }
                var page = this.$route.query.page;
                // 发起请求，获得数据
                this.$http.get("/article/fullArticles/0/" + page + searchValue
                ).then(resp => {
                    // console.log(resp.data); // 返回的Response体
                    // console.log(resp.data.username);

                    this.articleType = resp.data.articleType;
                    if (resp.data.searchValue === null || resp.data.searchValue === undefined){
                        this.searchValue = "";
                    } else {
                        this.searchValue = resp.data.searchValue;
                    }
                    this.pageInfo = resp.data.pageInfo;
                    this.pageIter = resp.data.pageIter;
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
                        // console.log("Error: ", error.message);
                        // this.errmsg = error.message;
                        this.open('请求出错‘，’请稍后重试')
                    }
                });
            },
        },

        mounted() {
            // 加载数据
            this.loadData();
            if ($(window).width() > 768) {
                this.$refs.searchInput.focus()
            }
        }

    }
</script>
<style>
  .blogs { width: 66%; float: left }
  .bloglist { background: #FFF; overflow: hidden; padding: 20px; margin-bottom: 20px; }
  .bloglist h2 { font-size: 18px; position: relative }
  .bloglist h2:before { content: ""; width: 3px; height: 26px; position: absolute; left: -20px; top: 0; background: #333 }
  .bloglist p { font-size: 13px; overflow: hidden; text-overflow: ellipsis; -webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 3; line-height: 24px; height: 72px; margin: 10px 0 0 }
  .blogs { width: 100% }
</style>
