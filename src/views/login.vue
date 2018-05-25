<template>
    <div id="login">
        <div class="log-content">
            <div class="log-box">
                <div class="log-logo">土地调查数据管理和辅助决策</div>
                <div class="log-email">
                    <p>欢迎登录</p>
                    <input type="text" placeholder="用户名" :class="'log-input' + (account==''?' log-input-empty':'')" v-model="account">
                    <input type="password" placeholder="密码" :class="'log-input' + (password==''?' log-input-empty':'')" v-model="password">
                    <a href="javascript:;" class="log-btn" @click="login">登录</a>
                </div>
            </div>
        </div>
        <div class="log-footer">@2017 广东省土地调查规划院</div>
    </div>
</template>

<script>
import { Loading } from 'element-ui'
// import hex_sha1 from "sha1/sha1"
import { mapActions } from 'vuex'
export default {
    name: 'Login',
    data() {
        return {
            account: '',
            password: ''
        }
    },
    methods: {
        ...mapActions(['FETCT_TOKEN']),

        //登录逻辑
        login() {
            if (this.account != '' && this.password != '') {
                this.toLogin();
            }
        },

        //登录请求
        toLogin() {
            //密码采用哈希值加密算法
            // let password_sha = hex_sha1(this.password);
            // console.log(password_sha);
              var SHA1 = require("crypto-js/SHA1");
              var password =  SHA1(this.password).toString()
            //需要想后端发送的登录参数
            let loginParam = {
                username: this.account,
                password: password
            }
            console.log('loginParam:'+JSON.stringify(loginParam))
            //设置在登录状态
            let load = Loading.service();

            this.$store.dispatch('FETCT_TOKEN', loginParam)
                .then(res => {
                    console.log(res.data.code);
                    if (res.data.code == 200) {
                        this.$router.push('/');
                      window.localStorage.setItem("userName", this.account)
                    } else if (res.data.code == 400) {
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    }
                    load.close()
                })
                .catch((error) => {
                    console.log(error.response.status);
                    this.$message({
                            message: error.response.status,
                            type: 'error'
                        });
                    load.close()
                })
        }
    },
    mounted() {
        let _this = this
        document.onkeyup = function (event) {
            var e = event || window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                _this.login()
            }
        }
    },
    beforeDestroy() {
        document.onkeyup = null
    }
}
</script>

