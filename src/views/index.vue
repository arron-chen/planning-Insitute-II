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
    </div>
    <div class="content-box">
    <div class="nav">
      <div class="collapse-btn" @click="taggleNav()"></div>
      <el-menu class="el-menu-vertical-demo"  unique-opened>
        <el-menu-item v-for="(item,index) of items" :index="item.name" :key="index" @click="addTab(item)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
      <el-tabs v-model="activeName" type="card"closable @tab-remove="removeTab">
        <el-tab-pane
          :key="item.name"
          v-for="(item, index) in menuList"
          :label="item.title"
          :name="item.name"
        >
          {{item.content}}
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>
<script>
  export default {
    data(){
      return {
        menuList:[],
        items:[{
          'name':'m1'
        },{
          'name':'m1'
        },{
          'name':'m1'
        },{
          'name':'m1'
        }],
        activeName:'1',
        tabIndex: 0,
        userName:'周冬雨'
      }
    },
    methods : {
      addTab(item) {
          let newTabName = ++this.tabIndex + '';
          this.menuList.push({
            title: item.name,
            name: newTabName,
            content: 'New Tab content'
          });
          this.activeName = item.name;
      },
      removeTab(targetName) {
        let tabs = this.menuList;
        let activeName = this.activeName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
      }
    },
  }
</script>


