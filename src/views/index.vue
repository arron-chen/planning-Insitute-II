<template>
  <div>
    <div class="header" id="header">

      <!--<div class="logo">土地调查数据管理与辅助决策系统</div>-->
      <div class="login">
        <img class="userimg" src="">
        <el-dropdown class="username">
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
        <div class="nav-list">
          <div v-for="(item,index) in menuList" @click="">
            <img class="navImg" src="../assets/image/menu1.png" />
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <div class="content-box">
    <div class="nav">
      <div class="collapse-btn" @click="taggleNav()"></div>
      <el-menu class="el-menu-vertical-demo"  unique-opened  :collapse="isCollapse">
        <el-menu-item v-for="(item,index) of secondMenu" :index="item.moduleId" :key="index" @click="addTab(item)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
      <div class="right-pane">
      <el-tabs v-model="activeModuleId" type="card"closable @tab-remove="removeTab">
        <el-tab-pane
          :key="item.moduleId"
          v-for="(item, index) in tabsList"
          :label="item.title"
          :name="item.moduleId"
        >
          <div v-html="item.content"></div>
          <!--{{item.content}}-->
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    data(){
      return {
        tabsList:[],
        // items:[],
        activeMenu:'20ddfe2c-096d-492e-ae02-140e1a77aaf8',
        items1:[
          {"moduleId": null,
            "name": null,
            "pageUrl": null,
            "imageUrl": null,
            "children": [
          {"moduleId": "20ddfe2c-096d-492e-ae02-140e1a77aaf8",
          "name": "业务设置",
          "pageUrl": null,
          "imageUrl": "/mainWeb/images/mobile/系统设置/symset.png",
          "children": [
            {
            "moduleId": "1eda0594-4b90-4363-80ea-137b9a8199b0",
            "name": "业务详情设置",
            "pageUrl": "/pubWeb/system/getMatterDeclareSetting",
            "imageUrl": null,
            "children": null,
            "parentId": "20ddfe2c-096d-492e-ae02-140e1a77aaf8",
            "sort": 0,
            "position": 100
          }, {
            "moduleId": "b645754d-449d-4ca4-8125-82e82534c3af",
            "name": "作业调度管理",
            "pageUrl": "/mainWeb/system/showJobSchedule",
            "imageUrl": "/mainWeb/images/mobile/系统设置/17.png",
            "children": null,
            "parentId": "20ddfe2c-096d-492e-ae02-140e1a77aaf8",
            "sort": 0,
            "position": 100
          }, {
            "moduleId": "8da5f948-681c-43d9-8264-25156ecc3471",
            "name": "子系统",
            "pageUrl": "/mainWeb/system/subSystem",
            "imageUrl": null,
            "children": null,
            "parentId": "20ddfe2c-096d-492e-ae02-140e1a77aaf8",
            "sort": 0,
            "position": 100
          }]
          },
          {"moduleId": "20ddfe2c-096d-492e-ae02-140e1a77aaf8",
            "name": "业务设置1",
            "pageUrl": null,
            "imageUrl": "/mainWeb/images/mobile/系统设置/symset.png",}]
          }
          ],
        activeModuleId:'1',
        tabIndex: 0,
        userName:'周冬雨',
        isCollapse: false,
      }
    },
    computed : {
      menuList(){
        // console.log(this.items1);
        return this.items1[0].children;
      },
      firstMenu(){
        return this.menuList;
      },
      secondMenu(){
        if(!this.activeMenu){return []}
        for(var i=0;i<this.menuList.length;i++){
          if(this.activeMenu == this.menuList[i].moduleId){
            return this.menuList[i].children;
          }
        }
      }
    },
    created() {
      let _this = this;
      //这里可放到全局，提供给子 iframe 调用
      window.addTab =  _this.addTab;
    },
    methods : {
      taggleNav: function () {
        if (this.isCollapse == false) {
          this.isCollapse = true
        } else {
          this.isCollapse = false;
        }
      },
      addTab(item) {
        console.log(item.moduleId);
        //if(item.moduleId || item.name || item.pageUrl){return;}
        let tabs = this.tabsList;
        let flag = true;
        tabs.forEach((tab, index) => {
          if (tab.moduleId == item.moduleId) {
            flag = false;
          }
        });
        if(flag) {
          let newTabName = ++this.tabIndex + '';
          this.tabsList.push({
            moduleId: item.moduleId,
            pageUrl: item.pageUrl,
            title: item.name,
            name: newTabName,
            // content: '<ifarme src="'+item.pageUrl+'"></ifarme>'
            content: '<div style="color: #1e88e5">123123</div>'
          });
          this.activeModuleId = item.moduleId;
        }
      },
      removeTab(moduleId) {
        let tabs = this.tabsList;
        let activeModuleId = this.activeModuleId;
        if (activeModuleId === moduleId) {
          tabs.forEach((tab, index) => {
            if (tab.moduleId === moduleId) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeModuleId = nextTab.moduleId;
              }
            }
          });
        }
        this.activeModuleId = activeModuleId;
        this.tabsList = tabs.filter(tab => tab.moduleId !== moduleId);
      }
    },
  }
</script>
<style scoped>
  .header-nav>.nav-list{
    padding: 10px 0;height: 55px;color:#fff;
  }
  .header-nav>.nav-list>div{
    display: inline-block;padding: 0 10px;
  }
  .navImg{
    margin-top: -3px;
    width: 35px;
    height: 35px;
    display: block;
    margin: 0 auto 2px;
  }
</style>

