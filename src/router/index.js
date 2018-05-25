/**
* @author gzk
* @time  08/15/2017
* @version 1.0
* @requires vue vue-router
*
*/
import Vue from 'vue'
import Router from 'vue-router'

const Login = resolve => require(["@/views/login.vue"], resolve)                  //登录页模板
const Index = resolve => require(["@/views/index.vue"], resolve)                  //系统主功能模板
const Home = resolve => require(["@/views/Home.vue"], resolve)                    //系统内容区首页模板
const Analysis = resolve => require(["@/views/analysis/index.vue"], resolve)      //系统内容区分析首页模板
const ReportForm = resolve => require(["@/views/reportform/index.vue"], resolve)  //系统内容区报表首页模板
const ReportManager = resolve => require(["@/views/report/index.vue"], resolve)   //系统内容区报告首页模板
const MapPgae = resolve => require(["@/views/map.vue"], resolve)                  //系统内容区地图模板
const SystemManagement = resolve => require(["@/views/systemManagement/index.vue"], resolve) //系统内容区系统管理
const TrendAnalysis = resolve => require(["@/views/trendAnalysis/index.vue"], resolve) //趋势分析

const DataProgram = resolve => require(["@/views/analysis/dataProgram/home.vue"], resolve) 
const DataProgramDetails = resolve => require(["@/views/analysis/dataProgram/details.vue"], resolve) 
const DataProgramChildDetails = resolve => require(["@/views/analysis/dataProgram/childdetails.vue"], resolve) 

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index,
            meta: { requiresAuth: true },
            children:[
                    { path: '/dataprogram/home', component: DataProgram},
                    { path: '/dataprogram/details', component: DataProgramDetails},
                    { path: '/dataprogram/childdetails', component: DataProgramChildDetails}
                ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})
