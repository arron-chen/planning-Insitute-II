<template>
  <div id="index">
    <div class="header" id="header">
      <!--<div class="logo">土地调查数据管理与辅助决策系统</div>-->
      <div class="login">
        <img class="userimg" src="">
        <!--<el-dropdown class="username" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{userName}}
                        <i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">用户信息</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="header-nav" >
        <!--<el-tabs id="content" @tab-click='openTabItem' v-model="activeName">
          <el-tab-pane v-for="(item,index) in menuList" :key='index' :label="item.name" :name="item.name">
            <div slot="label" class="header-nav-item"><img class="navImg" :src="'static/'+item.imageUrl">
              <p>{{item.name}}</p>
            </div>

          </el-tab-pane>
        </el-tabs>-->
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'

  export default {
    data(){
      return {
        home : true,
        analysis : false,
        map : false,
        report : false,
        reportForm : false,
        activeName:'首页',
        userName:'周冬雨'
      }
    },
    components : {
    },
    mounted(){
      // this.$store.dispatch('FETCT_NAVMENU')
      // this.userName = window.localStorage.getItem('userName')
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
      });
    },
    methods : {
      handleCommand(command){
        if(command == 'exit'){
          window.localStorage.removeItem('token')
          this.$router.push('/login')
        }
      },
      openTabItem(obj){

      },
    },
  }
</script>


