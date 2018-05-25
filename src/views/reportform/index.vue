<template>
  <div style="position:absolute;width:100%;top:0;bottom:30px;background-color:#ecf4f8;" id="reportForm">
    <div class="easyui-layout" id="cc1" style="position:absolute;top:0px;bottom:0px;width:100%">
      <div data-options="region:'west',split:true,collapsible:true,tools:'#tool'" title="报表" style="width:250px;">
        <div style="margin:10px">
        <el-input placeholder="请输入报表名称" v-model="reportName" style="width:120px;" size="small"></el-input>
        <el-button type="primary" size="small" @click="searchReport" style="margin-left:5px;">搜索</el-button>
        <el-button type="primary" size="small" @click="emptied" style="margin-left:5px;">清空</el-button>
        </div>
        <el-tree :data="regions" v-loading.body="loadTree" :props="defaultProps" :load="loadNode" lazy @node-click="treeNodeClick" ></el-tree>
      </div>
      <div id="tool">
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>
      <div data-options="region:'center',split:true">
        <div class="right-pane" id="reportFormContent">
          <el-tabs class="tabs" v-model="reportFormActiveTabName" @tab-remove="closeTab" type="card">
            <el-tab-pane v-for="item in reportFormTabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
              <component :is="item.component"></component>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../fetch/index'
  import TreeItem from './treeItem.vue'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data(){
      return {
        loadTree : false,
        isCollapse : false,
        defaultProps : {
          children :'children',
          label :'label',
          isLeaf:'IsReportTable'
        },
        treeData : [],
        //非正式代码
        regions : [],
        regions1 : [],
        //非正式代码
        props : {
          label : 'name',
          children : 'zones'
        },
        form : {
          nd : '15',  //年度
          xzdm : '',
          hz : '',
          pc : '',
        },
        openNode : '',
        reportName:''
      }
    },
    mounted(){
      this.$nextTick(() =>{
        $("#cc1").layout()
      })

      if(this.$store.state.home.openNewReportForm){
        this.treeNodeClick(this.$store.state.home.openNewReportForm)
      }
      let ExpanseReport = {
        expanseCata : '',
        onlyCata : 0
      }

      this.loadTree = true
      api.fetchGetExpanseReportCata(ExpanseReport)
      //api.fetchGetExpanseReportCata({params : ExpanseReport})
        .then(res =>{
          this.loadTree = false
          this.regions = res.data;
          //  this.treeData = res.data;
        })
    },
    computed : {
      reportFormActiveTabName : {
        get(){
          return this.$store.state.reportform.reportFormActiveTabName;
        },
        set(value){
          this.$store.commit("SET_REPORTFORMACTIVETABNAME", value);
        }
      },
      ...mapGetters({
        reportFormTabList : 'DONE_NAV_REPORTFORM_TABLIST'
      })
    },
    watch:{
        "$store.state.home.openNewReportForm":function(){
            if(this.$store.state.home.openNewReportForm){
               this.treeNodeClick(this.$store.state.home.openNewReportForm)
            }
        }
    },
    methods : {
      //搜索报表
      searchReport(){
         this.loadTree = true
         let ExpanseReport ={
          reportName:this.reportName
        }
        api.fetchGetSearchReports({params : ExpanseReport})
        .then(res=>{
          this.loadTree = false
          this.regions = res.data
        })
      },
      //清空条件
      emptied(){
        this.reportName =''
        this.getCatalog()
      },
      getCatalog(){
          let ExpanseReport = {
        expanseCata : '',
        onlyCata : 0
      }
         this.loadTree = true
     // api.fetchGetExpanseReportCata({params : ExpanseReport})
        api.fetchGetExpanseReportCata(ExpanseReport)
        .then(res =>{
          this.loadTree = false
          this.regions = res.data
          //  this.treeData = res.data;
        })

      },
      treeNodeClick(eve, node){
        if((eve.RID && eve.SRID)||(eve.children == null && eve.sRid !=null)){
          this.openTab(eve);
        } else {

        }
        // if(eve.children == null && eve.sRid !=null){
        //   this.openTab(eve);
        // } else {
        //
        // }
        // if(eve.children.length == 0 && eve.sRid !=null){
        //   console.log("eve");
        //   console.log(eve);
        //    this.openTab(eve);
        // } else {
        //
        // }
      },
      ...mapMutations({
        openTab : 'SET_REPORTFORMADDTAB'
      }),
      ...mapMutations({
        closeTab : 'SET_REPORTFORMCLOSETAB'
      }),
      taggleNav : function(){
        if(this.isCollapse == false){
          this.isCollapse = true;
        } else {
          this.isCollapse = false;
        }
      },
    renderContent(h, {node, data, store}){
        return h(TreeItem, {
          props : {
            value : data,
            treeNode : node
          },
          on : {
            input : (node) =>{
              data = node
            },
          }
        })
      },
      loadNode(node,resolve){
        if(node.id==0){
          return false
        }
        var result = JSON.stringify(node.data)
//        this.openNode = eve.rid
        let ExpanseReport = {
          expanseCata : result,
          onlyCata : 0
        }
        api.fetchGetExpanseReportCata(ExpanseReport)
       // api.fetchGetExpanseReportCata({params : ExpanseReport})
          .then(res =>{
            console.log('----->'+JSON.stringify(res.data))
            console.log(res.data);
            resolve(res.data.children)
          })
      }
    }
  }
</script>
<style scoped>
  .el-tree{
    border:none;
  }
</style>
