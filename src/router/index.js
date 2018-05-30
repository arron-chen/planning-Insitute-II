import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import list from '@/views/list'
import module from '@/components/module'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      meta:{
        title:'eView组件库'
      },
      component: index,
      children:[
        {
          path:'/',
          conponent:list,
          meta:{
            title:'eView组件列表'
          }
        }
      ]
    },
    {
      path:'/module/:id',
      meta:{
        title:'组件详情'
      },
      name:'module',
      component:module
    },
    //默认
    {
      path:'*',
      redirect:'/'
    }

  ]
})
