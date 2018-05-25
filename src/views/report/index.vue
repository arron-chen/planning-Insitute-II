 <template>
  <div style="position:absolute;width:100%;top:0;bottom:30px;background-color:#ecf4f8;" id="report ">
    <div class="easyui-layout" id="cc" style="position:absolute;top:0px;bottom:0px;width:100%">
      <div data-options="region:'west',split:true,collapsible:true,tools:'#tool1'" title="报告" style="width:250px;">
       <!--  <div style="margin:10px">
        <el-input placeholder="请输入报表名称" v-model="reportName" style="width:120px;" size="small"></el-input>
        <el-button type="primary" size="small" @click="searchReport" style="margin-left:5px;">搜索</el-button>
        <el-button type="primary" size="small" @click="emptied" style="margin-left:5px;">清空</el-button>
        </div> -->
        <el-tree :data="regions" v-loading.body="loadTree" :props="defaultProps":load="loadNode" lazy @node-click="treeNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="node.isLeaf">
          <el-button
            type="text"
            size="mini"
            @click="() => download(data)">
            下载
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
      <div id="tool1">
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>
      <div data-options="region:'center',split:true">
        <div class="right-pane">
          <el-tabs class="tabs" v-model="reportActiveTabName" @tab-remove="closeTab" type="card">
            <el-tab-pane v-for="item in reportTabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
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
 // import TreeItem from './treeItem.vue'
  import {mapMutations, mapGetters} from 'vuex'
 // let serviceURL = "http://10.0.0.7:8080";

  export default {
    data(){
      return {
        loadTree : false,
        isCollapse : false,
        defaultProps : {
          children : 'zones',
          label : 'label',
          isLeaf : 'isLeaf'
        },
        treeData : [],
        //非正式代码
        regions : [],
        regions1 : [],
        //非正式代码
        // props : {
        //   label : 'name',
        //   children : 'zones',

        // },
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
        $("#cc").layout()
      })
      api.fetchGetReportTree()
          .then(res =>{
          	this.regions = res.data
      })
      if(this.$store.state.home.openNewReport){
        this.treeNodeClick(this.$store.state.home.openNewReport)
      }
    },
    computed : {
      reportActiveTabName : {
        get(){
          return this.$store.state.report.reportActiveTabName;
        },
        set(value){
          this.$store.commit("SET_REPORTACTIVETABNAME", value);
        },
      },
      ...mapGetters({
        reportTabList : 'DONE_NAV_REPORT_TABLIST'
      })

    },
    watch:{
        "$store.state.home.openNewReport":function(){
            if(this.$store.state.home.openNewReport){
               this.treeNodeClick(this.$store.state.home.openNewReport)
            }
        }
    },
    methods : {

      getCatalog(){
         api.fetchGetReportTree()
          .then(res =>{
          //	console.log(res.data)
          	 this.regions = res.data
          })

      },
      treeNodeClick(eve, node){
      	 console.log(eve)
      	 if(eve.isLeaf  == true && eve.rid !=null){
      	 	 this.openTab(eve);
      	 }
        /*if(eve.children.length == 0 && eve.sRid !=null){
           this.openTab(eve);
        } else {

        }*/
      },
      ...mapMutations({
        openTab : 'SET_REPORTADDTAB'
      }),
      ...mapMutations({
        closeTab : 'SET_REPORTCLOSETAB'
      }),
      taggleNav : function(){
        if(this.isCollapse == false){
          this.isCollapse = true;
        } else {
          this.isCollapse = false;
        }
      },
    renderContent(h, {node, data, store}){
        /*return h(TreeItem, {
          props : {
            value : data,
            treeNode : node
          },
          on : {
            input : (node) =>{
              data = node
            },
          }
        })*/
      },
      loadNode(node,resolve){
      	if(node.data.Attributes){
      		console.log(node.data.Attributes.Ljlx)
      		 if(node.data.Attributes.Ljlx == 1){
           			resolve([])
       		} else if(node.data.Attributes.Ljlx == 0){
        		api.fetchGetReportTree({params : {sjjdbsm:node.data.rid}})
          			.then(res =>{
          	 			resolve(res.data)
          			})
        		}
      	}

      },
      download(data){
        if (data.url.indexOf('.') > 0) {
          var url = data.url.substr(0, data.url.indexOf('.'));
         // var downloadURL = serviceURL+url+'.docx';
          var downloadURL = url+'.docx';
          //console.log(downloadURL);
          window.location.href=downloadURL ;
        };

      }
    }
  }
</script>
<style scoped>
  .el-tree{
    border:none;
  }
</style>
