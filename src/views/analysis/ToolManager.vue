<template>
  <div id="toolManager" class="panel-content">
    <div data-options="region:'west',split:true,collapsible:true" title="工具列表" style="width:250px;">
      <div class="layout-box tool">
        <el-tree :render-content="renderContent" ref="myTree" v-loading.body="loadTree" :data="data" :props="defaultProps"
                 :highlight-current='true' @node-click='showProgramList($event)' node-key="id" :load="loadNode" lazy></el-tree>
      </div>
    </div>

    <div data-options="region:'center',split:true,collapsible:true" title="工具信息">
      <div class="layout-box">
        <el-table :data="parameters" style="width: 100%" @row-click='showDescription'>
          <el-table-column prop="name" label="参数名称"></el-table-column>
          <el-table-column prop="displayName" label="参数别名"></el-table-column>
          <el-table-column prop="dataType" label="数据类型"></el-table-column>
          <el-table-column label="参数方向">
            <template slot-scope="scope">
              <span>{{scope.row.direction | status(scope.row.direction)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="是否可选">
            <template slot-scope="scope">
              <span>{{scope.row.parameterType | parameterType(scope.row.parameterType)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div data-options="region:'east',split:true,collapsible:true,tools:'#toolEdit'" title="工具说明" style="width:250px;">
      <div class="description">{{description}}</div>
    </div>
    <div id="toolEdit">
      <a href="javascript:void(0)" class="icon-edit" @click="toolEdit" title="编辑"></a>
    </div>
    <el-dialog title="工具说明编辑" :visible.sync="dialogTableVisible">
      <el-input
        type="textarea"
        :rows="2"
        placeholder=""
        v-model="description">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from "../../fetch/index";
  //import { dragZone, dragHandle } from 'vue-drag-zone'
  import treeItem from "../../components/noTreeItem";

  export default {
    name: "datatool",
    data() {
      return {
        parameters: [],
        loadTree: false,
        data: [],
        description: "工具说明",
        dialogTableVisible: false,
        rid: '',          //保存说明上传的rid
        toolrid:'',     //保存完工具参数要刷新
        toolType: 0,         //0代编工具 ，1 代表工具参数
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf:"isLeaf"
        },
      };
    },
    components: {
      //	dragZone,
      //	dragHandle
      treeItem
    },
    filters: {
      status(statu) {
        if (statu == 0) {
          return "输入";
        }
        if (statu == 1) {
          return "输出";
        }
      },
      parameterType(parameterType) {
        if (parameterType == 0) {
          return "必选";
        }
        if (parameterType == 1) {
          return "可选";
        }
      }
    },
    mounted() {
      /** 2017/10/20
       *author:huangjianhui
       *功能:获取工具列表
       */
      $("#toolManager").layout();
      this.loadTree = true;
      api.fetchCatalog().then(res => {
        // console.log('-->'+JSON.stringify(res.data));
        this.data = res.data;
        this.loadTree = false;
      });
    },
    methods: {
      showProgramList(eve) {
        this.description = eve.attributes.description
        this.toolType = 0
        this.rid = eve.attributes.rid
        this.toolrid= eve.attributes.rid
        api.fetchParameter({params: {trid: eve.attributes.rid}}).then(res => {
          this.parameters = res.data;
        });
      },
      renderContent(h, {node, data, store}) {
        return h(treeItem, {
          props: {
            value: data,
            treeNode: node
          }
        });
      },
      showDescription(row) {
        this.toolType = 1
        this.rid = row.rid
        if (row.description === null) {
          this.description = "工具说明";
        } else {
          this.description = row.description;
        }
      },
      toolEdit() {
        if (this.dialogTableVisible === []) {
          return
        }
        this.dialogTableVisible = true
        this.toolTextarea = this.description
      },
      saveEdit() {
        if (this.toolType === 0) { //如果是工具
          api.setToolDescription({rid: this.rid, description: this.description})
            .then(res => {
              if(res.data.code==='200'){
                this.dialogTableVisible=false
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
              }else{
                alert(res)
              }
            })
        } else {
          api.setToolParaDescription({rid: this.rid, description: this.description})
            .then(res => {
              if(res.data.code==='200'){
                this.dialogTableVisible=false
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                api.fetchParameter({params: {trid: this.toolrid}}).then(res => {
                  this.parameters = res.data;
                });
              }else{
                alert(res)
              }
            })
        }
      },
      loadNode(node,resolve){
        console.log(node);
        if(node.id==0){
          return false;
        }
        console.log(node.data.id);
        api.fetchCatalog({params : {prid:node.data.id}}).then(res => {
            //console.log(res);
            if (res.status == "200") {
              console.log('-->'+JSON.stringify(res.data));
              resolve(res.data)
            }
          });
      }
    }
  };
</script>
<style lang='less'>
  .description {
    padding: 10px;
    font-size: 14px;
    line-height: 1.5;
  }
</style>

