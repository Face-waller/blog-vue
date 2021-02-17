<template>
  <main>

      <div class="col-sm-4 col-xs-12" style="padding-top: 10px;">

        <!--            只有大屏幕才显示,这样设置在不同class的div中，方便操作css，因为大小屏的样式差别太大,并且大屏下css是js动态修改的-->
        <div class="BigLeftSide" ref="BigLeftSide">

            <div class="input-group col-sm-10 hidden-xs" style="margin-left: 52px;padding: 10px">
              <input @keyup.enter="searchEnter" ref="searchInput" type="text" class="form-control" placeholder="输入关键词" v-model="searchValue"/>
              <span class="input-group-addon" @click="searchIcoClick"><i class="glyphicon glyphicon-search"></i></span>
            </div>
            <br>

            <div class="col-sm-12 hidden-xs ">

              <div class="newsbox" style="background-color:rgba(255,255,255,0)">
                <div class="newstitle" ><b>近期评论</b></div>
                <ul class="newsli">
                  <li v-for="(item,i) in comments">
                    <a >
                      <router-link
                        target="_parent"
                        :to="{ name:'articleRead', query:{ id: comments[i]['article_id'] } }"
                      >
                        {{ artN_comerN[i].comer_name }}  对文章  {{ artN_comerN[i].art_name }}  的评论 : {{ cutstr(comments[i].detail, 9) }}
                      </router-link>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="col-sm-12 hidden-xs ">
              <div class="newsbox" style="background-color:rgba(255,255,255,0)">
                <div class="newstitle" ><b>分类目录</b></div>
                <ul class="newsli">
                  <li><a target="_parent" title="友情投稿"><router-link :to="{ name:'typeArticle',query:{ type:1,page:1 } }">友情投稿--大家的投稿文章</router-link></a></li>
                  <li><a target="_parent" title="网站建设"><router-link :to="{ name:'typeArticle',query:{ type:2,page:1 } }">网站建设--关于我搭建本网站的文章</router-link></a></li>
                  <li><a target="_parent" title="其他"><router-link :to="{ name:'typeArticle',query:{ type:3,page:1 } }">其他--我其他的学习笔记</router-link></a></li>
                  <li><a target="_parent" title="Java"><router-link :to="{ name:'typeArticle',query:{type:4,page:1 } }">Java--我在Java学习中的一些笔记</router-link></a></li>
                  <li><a target="_parent" title="前端"><router-link :to="{ name:'typeArticle',query:{ type:6,page:1 } }">前端--对我前端学习的记录</router-link></a></li>
                  <li><a target="_parent" title="life"><router-link :to="{ name:'typeArticle',query:{type:5,page:1 } }">life--my life</router-link></a></li>
                </ul>
              </div>
            </div>

          </div>

        <!--          只有小屏幕xs才显示-->
        <div class="SmallSide">

          <div class="input-group hidden-lg hidden-md hidden-sm col-xs-8 col-xs-offset-1" style="padding-top: 20px">
            <input type="text" class="form-control" ref="searchInput" placeholder="输入关键词" v-model="searchValue" onkeydown="onKeyDown(event)"/>
            <span class="input-group-addon" @click="searchIcoClick"><i class="glyphicon glyphicon-search"></i></span>
          </div>
          <br>
          <div class="hidden-lg hidden-md hidden-sm col-xs-10" style="padding-top: 20px">
            <div class="newsbox" style="background-color:rgba(255,255,255,0)">
              <div class="newstitle" ><b>近期评论</b></div>
              <ul class="newsli">
                <li v-for="(item,i) in comments">
                  <a >
                    <router-link
                      target="_parent"
                      :to="{ name:'articleRead', query:{ id: comments[i]['article_id'] } }"
                    >
                      {{ artN_comerN[i].comer_name }}  对文章  {{ artN_comerN[i].art_name }}  的评论 : {{ cutstr(comments[i].detail, 9) }}
                    </router-link>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="hidden-lg hidden-md hidden-sm col-xs-10" style="padding-top: 20px">
            <div class="newsbox" style="background-color:rgba(255,255,255,0)">
              <div class="newstitle" ><b>分类目录</b></div>
              <ul class="newsli">
                <li><a target="_parent" title="友情投稿"><router-link :to="{ name:'typeArticle',query:{ type:1,page:1,searchValue:'' } }">友情投稿--大家的投稿文章</router-link></a></li>
                <li><a target="_parent" title="网站建设"><router-link :to="{ name:'typeArticle',query:{ type:2,page:1,searchValue:'' } }">网站建设--关于我搭建本网站的文章</router-link></a></li>
                <li><a target="_parent" title="其他"><router-link :to="{ name:'typeArticle',query:{ type:3,page:1,searchValue:'' } }">其他--我其他的学习笔记</router-link></a></li>
                <li><a target="_parent" title="Java"><router-link :to="{ name:'typeArticle',query:{type:4,page:1,searchValue:'' } }">Java--我在Java学习中的一些笔记</router-link></a></li>
                <li><a target="_parent" title="前端"><router-link :to="{ name:'typeArticle',query:{ type:6,page:1,searchValue:'' } }">前端--对我前端学习的记录</router-link></a></li>
                <li><a target="_parent" title="life"><router-link :to="{ name:'typeArticle',query:{type:5,page:1,searchValue:'' } }">life--my life</router-link></a></li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      <div class="col-sm-7 col-xs-12 pull-right" style="padding-top: 5px">

          <!--图-->
          <div class="col-sm-12 sunPhoto">
                <div class="hovereffect">
                  <img class="img-rounded" style="height: 500px" src="../../assets/images/sun.png" alt="">
                </div>
          </div>

          <!--文章-->
          <div class="col-sm-12 col-sx-10">
            <div class="bloglist" style="background-color:rgba(255,255,255,0)">
              <template v-for="(item,i) in articles">
                <h2><a :title="item.title"><router-link :to="{ name:'articleRead',query:{ id:item.id } }">{{ cutstr(item.title,60) }}</router-link></a></h2>
                <p>{{ item.descriptive }}</p>
              </template>

            </div>
          </div>

      </div>

  </main>
</template>

<script>
  import * as jQuery from "../../assets/jquery-3.3.1.min"
  import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min";

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name:"index",
        data() {
            return {
                searchValue:'', // 搜索值
                errmsg:'',   // 错误提示
                comments:[{
                        'id':0,
                        'create_time':'',
                        'is_delete':false,
                        'detail':'',
                        'article_id':0,
                        'user_id':0
                    }], // 评论集
                articles:[{
                    'id':0,
                    'create_time':'',
                    'is_delete':false,
                    'title':'',
                    'descriptive':'',
                    'is_secrete':false,
                    'detail':'',
                    'type_id':0,
                    'user_id':0
                }], // 文章集
                artN_comerN:[{
                    'comer_name':'',
                    'art_name':''
                }], // 评论回复对应集

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
        methods:{
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
                // 跳转 所有文章列表界面
                this.$router.push( {
                    name:"fullTextSearch",
                    query:{ page:"1", searchValue: this.searchValue }
                } );
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
                this.$http.get("/article/indexData").then(resp => {
                    // console.log(resp.data); // 返回的Response体
                    // console.log(resp.data.username);

                    this.comments = resp.data.comments;
                    this.articles = resp.data.articles;
                    this.artN_comerN = resp.data.artN_comerN;
                }).catch(error => {
                    this.open('加载失败','请稍后刷新重试');
                });
            },

            /**
             * 函数说明：获取字符串长度
             * 备注：字符串实际长度，中文2，英文1
             * @param:需要获得长度的字符串
             */
            getStrLength(str) {
              var realLength = 0, len = str.length, charCode = -1;
              for (var i = 0; i < len; i++) {
                  charCode = str.charCodeAt(i);
                  if (charCode >= 0 && charCode <= 128){
                      realLength += 1;
                  }else{
                      realLength += 2;
                  }
              }
              return realLength;
            },
            /**
             * js截取字符串，中英文都能用
             * @param str：需要截取的字符串
             * @param len: 需要截取的长度
             */
          cutstr(str, len) {
              var str_length = 0;
              var str_len = 0;
              var str_cut = '';
              str_len = str.length;
              for (var i = 0; i < str_len; i++) {
                  var a = str.charAt(i);
                  str_length++;
                  if (escape(a).length > 4) {
                      //中文字符的长度经编码之后大于4
                      str_length++;
                  }
                  str_cut = str_cut.concat(a);
                  if (str_length >= len) {
                      str_cut = str_cut.concat("...");
                      return str_cut;
                  }
              }
              //如果给定字符串小于指定长度，则返回源字符串；
              if (str_length < len) {
                  return str;
              }
          },
            /**
             * 获取json长度
             * @param jsonData
             * @returns {number}
             */
          getJsonLength(jsonData){

              var jsonLength = 0;

              for(var item in jsonData){

                  jsonLength++;

              }

              return jsonLength;

          },

        },
        mounted () {
            // 加载数据
            this.loadData();
            // 进入页面聚焦input框
            if ($(window).width() > 768) {
                this.$refs.searchInput.focus()
            }
        },
    }
</script>

<style>

/*侧边栏样式*/
.newstitle { line-height: 30px; border-bottom: #000 1px solid; }
/*.newstitle span { float: right; font-size: 18px }*/
/*.newstitle span a { color: #000; }*/
.newstitle b { background: #9fcdff; width: 118px; display: block; font-size: 14px; font-weight: normal; color: #FFF; text-align: center }
.newsli li { line-height: 30px; text-overflow: ellipsis; overflow: hidden; font-size: 15px}
.newsli a{color: #000}
.newsbox { width: 50%; background: #fff; margin-top: 20px }
.newsbox { width: 100% }
/*侧边栏样式end*/

/*文章列表*/
.bloglist { background: #FFF; overflow: hidden; padding: 20px; margin-bottom: 20px; }
.bloglist h2 { font-size: 18px; position: relative }
.bloglist h2:before { content: ""; width: 3px; height: 26px; position: absolute; left: -20px; top: 0; background: #333 }
.bloglist p { font-size: 13px; overflow: hidden; text-overflow: ellipsis; -webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 3; line-height: 24px; height: 72px; margin: 10px 0 0 }
/*文章列表end*/

/*图片特效*/
.hovereffect {
  width: 750px;
  height: 100%;
  float: left;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: default;
}
.hovereffect .overlay {
  position: absolute;
  overflow: hidden;
  opacity: 0;
  filter: alpha(opacity=0);
  width: 55%;
  height: 81%;
  left: 22%;
  top: 10%;
  border-radius: 80%;
  border: 2px solid #FFF;
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(50%,50%,0);
  transform: translate3d(50%,50%,0);
}
.hovereffect:hover .overlay {
  background-color: rgba(0,0,0,0.3);
}
.hovereffect img {
  display: block;
  position: relative;
  -webkit-transition: all 0.35s;
  transition: all 0.35s;
}
.hovereffect:hover img {
  filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="linear" slope="1.4" /><feFuncG type="linear" slope="1.4" /><feFuncB type="linear" slope="1.4" /></feComponentTransfer></filter></svg>#filter');
  filter: brightness(1.4);
  -webkit-filter: brightness(1.4);
}
.hovereffect h2 {
  text-transform: uppercase;
  text-align: center;
  position: relative;
  font-size: 17px;
  padding: 10px;
  background-color: transparent;
  color: #FFF;
  padding: 1em 0;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(-150%,-400%,0);
  transform: translate3d(-150%,-400%,0);
}
.hovereffect a, .hovereffect p {
  color: #FFF;
  padding: 1em 0;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(-150%,-400%,0);
  transform: translate3d(-150%,-400%,0);
}
.hovereffect:hover a, .hovereffect:hover p, .hovereffect:hover h2, .hovereffect:hover .overlay {
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}
/*图片特效end*/

  @media screen and (max-width: 1380px){
    .sunPhoto {
      display: none;
    }
  }
</style>
