<template>
  <div id="index">
    <div class="header" id="header">
      <!--<div class="logo">土地调查数据管理与辅助决策系统</div>-->
      <div class="login">
        <img class="userimg" src="../assets/image/user2.gif">
        <el-dropdown class="username" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{userName}}
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">用户信息</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="header-nav" >
        <el-tabs id="content" @tab-click='openTabItem' v-model="activeName">
          <el-tab-pane v-for="(item,index) in menuList" :key='index' :label="item.name" :name="item.name">
            <div slot="label" class="header-nav-item"><img class="navImg" :src="'static/'+item.imageUrl">
              <p>{{item.name}}</p>
            </div>
            <v-home v-if="item.pageUrl=='/home'&&home"></v-home>
            <v-analysis v-if="item.pageUrl=='/analysis'&&analysis"></v-analysis>
            <trend-analysis v-if="item.pageUrl=='/trendAnalysis'&&trendAnalysis"></trend-analysis>
            <v-map v-if="item.pageUrl=='/map'&&map"></v-map>
            <v-report-form v-if="item.pageUrl=='/reportform'&&reportForm"></v-report-form>
            <v-report v-if="item.pageUrl=='/reportdisplay'&&report"></v-report>
            <sys-management v-if="item.pageUrl=='/systemmanagement'&&systemmanagement"></sys-management>
            <map-manager v-if="item.pageUrl=='/mapmanager'&&mapManager"></map-manager>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import VFooter from '../components/Footer'

  import sysManagement from './systemManagement/index'     //系统管理
  import VHome from './Home'								 //首页
  import VAnalysis from './analysis/index'                 //分析
  import VMap from './map'    					         //地图
  import VReportForm from './reportform/index'             //报表
  import VReport from './report/index'                     //报告展示
  import trendAnalysis from './trendAnalysis/index'                     //趋势分析
  import mapManager from './mapmanager/index'


  export default {
    data(){
      return {
        home : true,
        analysis : false,
        map : false,
        report : false,
        reportForm : false,
        reportmanager : false,
        systemmanagement : false,
        trendAnalysis:false,
        mapManager:false,
        activeName:'首页',
        userName:'周冬雨'
      }
    },
    components : {
      VFooter,
      VHome,
      VAnalysis,
      VMap,
      VReportForm,
      VReport,
      sysManagement,
      trendAnalysis,
      mapManager
    },
    mounted(){
      this.$store.dispatch('FETCT_NAVMENU')
      this.userName = window.localStorage.getItem('userName')
    },
    computed : {
      ...mapState({
        menuList : "menuList"
      })
    },
    created() {
      this.$root.eventHub.$on('toTab',(target) => {
          this.activeName= target.name
          this.openTabItem({label:target.name})
          if(target.name=="报告"){
             this.$store.state.home.openNewReport = target.data;
          } else if(target.name=="报表"){
            this.$store.state.home.openNewReportForm = target.data;
          }

      });
    },
    methods : {
      handleCommand(command){
        if(command == 'exit'){
          window.localStorage.removeItem('token')
          this.$router.push('/login')
        }
        if(command == 'a'){
          alert("功能开发中...")
        }
      },
      openTabItem(obj){
        if(obj.label == '首页'){
          if(document.querySelector('#home')){
            return false
          } else {
            this.home = true
          }
        }
        if(obj.label == '分析'){
          // console.log(obj)
          if(document.querySelector('#analysis')){
            return false
          } else {
            this.analysis = true
          }
        }
        if(obj.label == '报表'){
          if(document.querySelector('#reportForm')){
            return false
          } else {
            this.reportForm = true
          }
        }
        if(obj.label == '报告'){
          if(document.querySelector('#report')){
            return false
          } else {
            this.report = true
          }
        }
        if(obj.label == '地图'){
          if(document.querySelector('#map')){
            return false
          } else {
            this.map = true
          }
        }
        if(obj.label == '系统管理'){
          if(document.querySelector('#systemmanagement')){
            return false
          } else {
            this.systemmanagement = true
          }
        }
        if(obj.label == '趋势分析'){
          if(document.querySelector('#trendAnalysis')){
            return false
          } else {
            this.trendAnalysis = true
          }
        }
        if(obj.label == '地图管理'){
          if(document.querySelector('#mapManager')){
            return false
          } else {
            this.mapManager = true
          }
        }
      },
    },




  }
</script>


