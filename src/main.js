import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery/dist/jquery.min'
import util from './util/util'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)


//引入工具，配置代理
Vue.prototype.$utilHelper = util

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!window.localStorage.getItem('token')) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    data:{
        eventHub: new Vue()
    }
})
