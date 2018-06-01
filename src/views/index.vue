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
          <div v-for="(item,index) in menuList" @click="switchMenu(item.moduleId, index)" :class="isActive==index?'is-active':''">
            <img class="navImg" src="../assets/image/menu1.png" />
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <div class="content-box">
    <div class="nav" v-if="secondMenu && secondMenu.length>0">
      <div class="collapse-btn" @click="taggleNav()"></div>
      <el-menu class="el-menu-vertical-demo"  unique-opened  :collapse="isCollapse">
        <el-menu-item v-for="(item,index) of secondMenu" :index="item.moduleId" :key="index" @click="addTab(item)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
      <div class="right-pane">
      <el-tabs v-if="tabsList" v-model="activeModuleId" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          :key="item.moduleId"
          v-for="(item, index) in tabsList"
          :label="item.title"
          :name="item.moduleId"
          :ref="item.moduleId"
          :data-parent="item.parentId"
        >
          <!--<slot ><tab-cont :moduleId="item.moduleId"-->
                           <!--:iframeWidth="iframeWidth"-->
                           <!--:splitWidth="splitWidth"-->
                           <!--:ishowScreen="ishowScreen"-->
                           <!--:iframURL="item.pageUrl"-->
                           <!--:splitCont="splitCont"-->
          <!--&gt;</tab-cont></slot>-->
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </div>

</template>
<script>
  //import tabCont from '@/components/tabCont';
  export default {
    data(){
      return {
        tabsList:[],
        // items:[],
        activeMenu:'',
        items1:[
          {"moduleId": null,
            "name": null,

            "pageUrl": '../../static/test.html',
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

            "pageUrl": '../../static/test.html',
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
          {"moduleId": "20ddfe2c-096d-492e-ae02-140e1a77aaf82",
            "name": "业务设置1",
            "pageUrl": null,
            "imageUrl": "/mainWeb/images/mobile/系统设置/symset.png",}]
          }
          ],
        activeModuleId:'1',
        tabIndex: 0,
        userName:'周冬雨',
        isCollapse: false,
        isActive: -1,
        ishowScreen:true,
        iframeWidth:'100%',
        splitWidth:'',
        splitCont:'',
        splitURL:'',
      }
    },
    components:{},
    computed : {
      menuList(){
        // console.log(this.items1);
        return this.items1[0].children;
      },
      firstMenu(){
        return this.menuList;
      },
      secondMenu(){
        let rs = [];
        if(!this.activeMenu){return rs;}
        for(var i=0;i<this.menuList.length;i++){
          if(this.activeMenu == this.menuList[i].moduleId){
            rs = this.menuList[i].children;
          }
        }
        return rs;
      }
    },
    created() {
      let _this = this;
      //这里可放到全局，提供给子 iframe 调用
      window.addTab =  _this.addTab; //打开一个页
      window.closePage = _this.removeTab; //关闭指定标签页
      window.showPage = _this.switchTab; //切换显示指定标签页
      window.setTabName = _this.setTabName; //设置标签页的title
      window.getCurPage = _this.getCurPage; //获得当前显示页的操作对象
      window.findTapWindow = function(){ return _this.findTapWindow(_this.activeModuleId)}; //查找当前模块窗口对象
      window.splitScreen = _this.splitScreen; //分栏操作
      window.splitscreenIsOpen=_this.splitscreenIsOpen;
      window.loadScreenContent=_this.loadScreenContent;
      window.loadScreenUrl =_this.loadScreenUrl;
    },
    methods : {
      switchMenu: function (modulId,index) {
        this.activeMenu = modulId;
        this.isActive = index;
      },
      taggleNav: function () {
        if (this.isCollapse == false) {
          this.isCollapse = true
        } else {
          this.isCollapse = false;
        }
      },
      addTab(item) {
        //if(item.moduleId || item.name || item.pageUrl){return;}
        let tabs = this.tabsList;
        let flag = true;
        tabs.forEach((tab, index) => {
          if (tab.moduleId == item.moduleId) {
            this.activeModuleId = item.moduleId;
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
            content:``

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
      },
      switchTab(moduleId){
        this.activeModuleId = moduleId;
      },
      setTabName(moduleId, name){
        if(moduleId){
          let tabs = this.tabsList;
          tabs.forEach((tab, index) => {
            if (tab.moduleId == moduleId) {
              tab.title = name;
            }
          });
        }
      },
      splitScreen(pageId,isSplit){
        if(isSplit==true){
            this.ishowScreen=true;
            this.iframeWidth='50%';
            this.splitWidth="50%";
        }else{
          this.ishowScreen=true;
          this.iframeWidth='100%';
          this.splitWidth="0";
        }
      },
      splitscreenIsOpen(){},
      loadScreenContent(html){
          this.splitCont=html;
      },
      loadScreenUrl(url,pageId){
        var html =`<iframe class="splitIframe" src=${url} style="width:100%;height:100%;"></iframe>`;
        this.splitCont=html;
      },

	    getTabName(moduleId){
        let rs = null;
        if(moduleId){
          let tabs = this.tabsList;
          tabs.forEach((tab, index) => {
            if (tab.moduleId == moduleId) {
              rs = tab.title;
            }
          });
        }
        return rs;
      },
      findTapWindow(moduleId){
        if(moduleId) {
          let wapper = this.$refs[moduleId][0].$el || null;
          if (wapper) {
            return wapper.getElementsByTagName('iframe')[0].contentWindow || null;
          }
        }
      },
      /**
       * @returns {
       *      container:标签页的jquery对象，以li为根节点。
       *      getModId,获得当前模块ID
       *      getTitle,获得当前模块标题
       *      setTitle,设置当前模块标题}
       */
      getCurPage(){
        let _this = this;
        let rs = null;
        if(_this.activeModuleId){
          rs = {
            container: _this.$refs[_this.activeModuleId][0].$el || null,
            getModId: function(){return _this.activeModuleId},
            setTitle: function(name){_this.setTabName(_this.activeModuleId,name);},
            getTitle: function(){return _this.getTabName(_this.activeModuleId)}
          }
        }
        return rs;
      }
    },
    mounted(){
    }
  }
</script>
<style>
  .header-nav>.nav-list{
    padding: 10px 0;height: 55px;color:#fff;
  }
  .header-nav>.nav-list>div{
    display: inline-block;margin: 0 10px;cursor: pointer;
  }
  .header-nav>.nav-list>.is-active{
    background-color: #4ba0ea;
  }
  .navImg{
    margin-top: -3px;
    width: 35px;
    height: 35px;
    display: block;
    margin: 0 auto 2px;
  }
  .list_box{
    width:100%;height:100%;
    position:relative;
  }
  .iframepage {
    border: none;
    height: 100%;
    width: 100%;
    position: absolute;
    top:0;bottom:0;
    left:0;

  }
  .splitscreen{
    position: absolute;
    top:0;bottom:0;
    right:0;
    width:0%;
    height:100%;overflow:hidden;cursor:default;font-size:14px;
    border:1px solid #efefef;
    transition:all linear .7s;
  }

</style>

