<template>
  <div style="padding-bottom: 40%; padding-top: 1%">
    <div class="col-sm-5 col-sm-offset-3">
      <div class="text-center" style="font-size: 20px; padding-bottom: 2%; color: #d43f3a">
        番茄博客
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="username">
          <el-input v-model.trim="ruleForm.username" ref="PetNameInput" autocomplete="off" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model.trim="ruleForm.pass" @keyup.enter="submitForm('ruleForm')" ref="PwdNameInput" autocomplete="off" placeholder="密 码"></el-input>
        </el-form-item>
        <el-form-item label="记住昵称" prop="remember">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain :disabled="disabled" @click="submitForm('ruleForm')">登录</el-button>
          <router-link :to="{name:'register'}">
            <el-button>
              去注册
            </el-button>
          </router-link>
          <span style="color: red; font-size: 16px">{{errmsg}}</span>
          <br>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    // import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min"

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name:'login',
        data() {

            var validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('昵称不能为空'));
                }
                setTimeout(() => {
                    if (value.length > 8) {
                        callback(new Error('昵称不超过8位'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (value.length > 6) {
                        callback(new Error('密码不超过6位'))
                    }else {
                        callback();
                    }
                    callback();
                }
            };

            return {
                errmsg:'',
                disabled: false,
                ruleForm: {
                    username:'',
                    pass: '',
                },
                rules: {
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],

                },
                form: {
                    delivery:false
                },
            };
        },
        methods: {
            // enter事件去登录
            EnterToLogin() {
                this.submitForm("ruleForm");
            },

            // element
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 锁定按钮
                        this.disabled = true;
                        // 登录请求
                        this.loginRequest();

                    } else {
                        console.log('参数校验失败!');
                        return false;
                    }
                });
            },

            // 发起登录请求
            loginRequest() {
                // 发起请求,请求成功则存储记住昵称标记，请求失败则取消勾选记住昵称
                this.$http.post(
                    "/user/login",
                    {username:this.ruleForm.username,"pass":this.ruleForm.pass}
                )
                .then(res => {
                    // 登录成功
                    if (this.form.delivery) {
                        // 记住昵称
                        localStorage.setItem("username",res.data.username);
                    } else {
                        // 不记住昵称
                        if (localStorage.getItem("username")) {
                            localStorage.removeItem("username")
                        }
                    }
                    // 获取路由拦截时存入的redirectUrl，跳转到登录前页面
                    var redirect = localStorage.getItem("redirectUrl");
                    // 刷新页面，更新页面数据
                    this.reload();
                    if (redirect) {
                        localStorage.removeItem("redirectUrl");
                        this.$router.replace(redirect);
                    } else {
                        this.$router.replace({name:"/index"})
                    }
                })
                .catch(error => {
                    // 登录失败，需要设置错误提示
                    /* 不能使用this对象来操作错误提示,在 then的内部不能使用Vue的实例化的this, 因为在内部 this 没有被绑定。
                    *解决办法：
                    *1、用ES6箭头函数，箭头方法可以和父方法共享变量
                    *2、在请求axios外面定义一下 var that=this
                    */

                    /**
                     * 失败则不记住用户名
                     */
                    if (localStorage.getItem("username")) {
                        // 不记住昵称
                        localStorage.removeItem("username");
                    }
                    /**
                     * 可将整个error转为json字符串: this.errmsg = error.toJSON().message;
                     * 下面对error进行判断,
                     */
                    if(error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                       /*console.log("response-data: ", error.response.data);
                        console.log("response-statues: ", error.response.status);
                        console.log("response-headers: ", error.response.headers);*/
                        this.errmsg = error.response.data.message;
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log("请求超时");
                        this.errmsg = "请求超时,请检查网络或客户端"
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        // console.log("error-config: ", error.config);
                        console.log("Error: ", error.message);
                        this.errmsg = error.message;
                    }
                    // 释放按钮
                    this.disabled = false;
                });

            },

        },

        mounted() {

        },

        beforeRouteEnter(to, from, next){
            //刷新login页面的from.path是"/"
            if (from.path === "/register" || from.path === "/login" || from.path === "/") {
                // 来自于register
                if(!localStorage.getItem("redirectUrl")) {
                    // 没有重定向,设置重定向到首页
                    localStorage.setItem("redirectUrl", "/index");
                }
            } else {
                // 不来自于register
                if(localStorage.getItem("redirectUrl")) {
                    // 有重定向值，删除后设置重定向
                    localStorage.removeItem("redirectUrl");
                    localStorage.setItem("redirectUrl", from.fullPath);
                }else {
                    // 没有重定向值,设置重定向
                    localStorage.setItem("redirectUrl", from.fullPath);
                }
            }
            var user = localStorage.getItem("username");
            if(user){
                // 存储了记住密码
                var remem = true;
                next(vm => {
                    /*此时vue实例还未创建，通过此函数可以操作，只有beforeRouteEnter有此
                    方法，因为只有beforeRouteEnter时vue实例未创建*/

                    // 回显记住密码
                    vm.form.delivery = remem;
                    // 回显用户名
                    vm.ruleForm.username = user;
                    // 焦点到密码输入框
                    vm.$refs.PwdNameInput.focus();
                })
            } else {
                next(vm => {
                    //焦点到昵称输入框
                    vm.$refs.PetNameInput.focus();
                })
            }
            next();
        }

    }
</script>
<style>

</style>
