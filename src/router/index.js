import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// 路由懒加载
function route (path, name, file) {
  return {
    path:path,
    name:name,
    // component: () => import('../pages' + file)
    component(resolve) {
      require(['../pages'+file],resolve)
    }
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path:'/',
      // component: () => import('../pages/Layout'),
      component(resolve) {
          require(['../pages/Layout'],resolve)
      },
      redirect:"/index",
      children:[
        route("/index", "index", "/other/Index"),
        route("/log", "log", "/other/Log"),
        route("/about", "about", "/other/About"),
        route("/userAgreement", "agreement", "/user/UserAgreement"),
        route("/login", "login", "/user/Login"),
        route("/register", "register", "/user/Register"),
        route("/articleRead","articleRead","/article/ArticleReadOfCkEditor"),
        route("/fullTextSearch","fullTextSearch","/article/FullTextSearchList"),
        route("/myArticle", "myArticle", "/article/MyArticleList"),
        route("/typeArticle", "typeArticle", "/article/TypeArticleList"),
        route("/leaveMessage", "leaveMessage", "/other/LeaveMessage"),
       /* route("/articleWrite","articleWrite","/article/ArticleWriteOfCkEditor"), // thymeleaf 请求路径写死 ，写文章按钮
        route("/modifyArticle","modifyArticle","/article/ModifyArticleOfCkEditor"), // thymeleaf 请求路径写死 ，编辑文章按钮*/

      ]
    },
    /*route("/test", "/test", "/user/test")*/

  ],
  // 加载页面不在顶部问题
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0}
  }

})
