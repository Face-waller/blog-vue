<template>
  <div style="padding-bottom: 40%; padding-top: 1%">
    <div class="col-sm-5 col-sm-offset-3">
      <div class="text-center" style="font-size: 20px; padding-bottom: 2%; color: #d43f3a">
        番茄博客
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="username">
          <el-input v-model.trim="ruleForm.username" ref="RegisterPetInput" placeholder="不超过8位,中文或字母组成" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model.trim="ruleForm.pass" autocomplete="off" placeholder="不超过6位字母或数字组成"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model.trim="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item
          label="输入邮箱"
          prop="email"
          :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]"
        >
          <el-input v-model.trim="ruleForm.email" @keyup.enter="submitForm('ruleForm')" autocomplete="off" placeholder="激活件会发送此邮箱/垃圾箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain :disabled="disabled" @click="submitForm('ruleForm')">注册</el-button>
          <router-link :to="{name:'login'}">
            <el-button>
              去登录
            </el-button>
          </router-link>
          <span style="color: red; font-size: 16px">{{errmsg}}</span>
          <br>
          <!--协议提示-->
          <div class="col-sm-offset-0 register-sign">
            <span class="asterisk">* </span> 点击“注册”按钮表示您同意并愿意遵守 <a class="look-agreeon" target="_blank"><router-link :to="{name:'agreement'}">用户协议</router-link></a>。
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    import * as jQuery from "../../assets/jquery-3.3.1.min"
    import * as bootstrap from "../../assets/bootstrap3.3.7/bootstrap.min"

    export default {
        inject:['reload'],      // 注入App里的reload方法
        name:'register',
        data() {
            var validateusername = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('昵称不能为空'));
                }
                setTimeout(() => {
                    if (value.length > 8 ) {
                        callback(new Error('长度不能超过8位'));
                    }else {
                        callback();
                    }
                }, 1000);
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (value.length > 6) {
                        callback(new Error('长度不能超过6位'));
                    }
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                errmsg:'',
                disabled:false,
                ruleForm: {
                    username: '',
                    pass: '',
                    checkPass: '',
                    email: '',
                },
                rules: {
                    username: [
                        { validator: validateusername, trigger: 'blur'}
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],

                },
            };
        },
        methods: {
            // element
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 使按钮不可用
                        this.disabled = true;
                        // 请求后端
                        this.$http.post("/user/register", {"username":this.ruleForm.username, "pass":this.ruleForm.pass, "email":this.ruleForm.email}
                        )
                        .then(res => {
                            // 注册成功
                            /**
                             * 开始是，注册成功，后端会直接颁发token，但没有考虑用户未激活的情况，所以改回去
                             */
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
                            // 注册失败，需要设置错误提示
                            /* 不能使用this对象来操作错误提示,在 then的内部不能使用Vue的实例化的this, 因为在内部 this 没有被绑定。
                            *解决办法：
                            *1、用ES6箭头函数，箭头方法可以和父方法共享变量
                            *2、在请求axios外面定义一下 var that=this
                            */

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
                    } else {
                        return false;
                    }
                });
            },

        },
        mounted() {
            this.$refs.RegisterPetInput.focus();
        }
    }
</script>
<style>

</style>
