<template>
  <div id="searchManager"  class="panel-content">
     <div  data-options="region:'west',split:true"  title="图层设置" style="width:600px;">
      <div class="searchManager-data-tool">
       <el-button type="primary" icon="el-icon-refresh" size="small" @click=" ">刷新</el-button>
       <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="addMap">新增</el-button>
       <el-button type="primary" icon="el-icon-document" size="small" @click=" ">保存</el-button>
       <el-button type="primary" icon="el-icon-delete" size="small" @click="delGlobalsearch">删除</el-button>
      </div>
      <div>
        <el-table ref="singleTable" border :data="leftTable" highlight-current-row @current-change="handleCurrentChange"  >
            <el-table-column type="index" label="排序" width="60"> </el-table-column>
            <el-table-column property="searchName" label="图层名"> </el-table-column>
                    <el-table-column property="layerRestUrl" label="服务地址"> </el-table-column>
          </el-table>
      </div>   
     </div>
     
    <div data-options="region:'center',split:true"  title="字段设置" style="padding:10px 5px 10px 5px;border-left:none">
         <el-table ref="singleTable" border :data="rightTable">
            <el-table-column property="name" label="字段名"> </el-table-column>
            <el-table-column property="alias" label="别名"> </el-table-column>
                    <el-table-column  label="主标题">
                    <!--   <template slot-scope="scope">
                       <el-radio v-model="titleField" :label="scope.row.name">&nbsp</el-radio>
                     </template> -->
                    </el-table-column>
                    <el-table-column   label="查询字段"  >
                        <!-- <template slot-scope="scope">
                            {{scope.row.searchFieldSelect}}
                         
                        </template>  -->  
                    </el-table-column>
                    <el-table-column property=" " label="显示字段"  > </el-table-column>
          </el-table>
    </div>

    <el-dialog title="添加图层" :visible.sync="addMapLayers" size=tiny >
        <el-tree :data="layerTree" :props="defaultProps" @node-click="layerTreeNodeClick"  highlight-current :expand-on-click-node="false" v-loading="loadTree">
         </el-tree>
      <div slot="footer" class="dialog-footer">
            <el-button @click="addMapLayers=false" size=small>取 消</el-button>
            <el-button type="primary" @click="addMapLayersSubmit" size=small>确 定</el-button>   
          </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from '../../fetch/index'
  export default{
    data(){
      return {
        currentRow:'',
        leftTable: [],
        rightTable: [],
        SublayerService:'',
        SublayerRid:'',
        addMapLayers:false,
        loadTree:false,
        layerTree:[],
        defaultProps: {
                children: 'children',
                label: 'text'
            },
            titleField:''
      }
    },
    mounted(){
      $('#searchManager').layout();
      //左侧表格数据
    //  this.getGlobalsearchAll()
       
     },
      methods:{
        getGlobalsearchAll(){
          api.fetchGetGlobalsearchAll()
          .then(res=>{
            console.log(res.data)
            this.leftTable = res.data;
          })
        },
        getGlobalsearchLayerfields(){
          let data ={
            sublayerService: this.SublayerService
          }
          api.fetchGetGlobalsearchLayerfields({params:data})
          .then(res=>{
            console.log(res.data)

            this.rightTable = res.data
            for(var i=0;i<this.rightTable.length;i++){
              if(this.rightTable[i].alias == 'OBJECTID'){
                this.rightTable[i].searchFieldSelect = true
              } else {
                this.rightTable[i].searchFieldSelect = false
              }
            }
            console.log(this.rightTable)
          })
        },
      //左侧表格选中
          handleCurrentChange(val) {
            this.currentRow = val;
            console.log(this.currentRow)
            this.SublayerService = this.currentRow.layerRestUrl;
            this.SublayerRid =  this.currentRow.rid;
            this.titleField = this.currentRow.titleField;
            console.log('显示字段:'+this.currentRow.detailFields) 
            console.log('主标题:'+this.currentRow.titleField) 
            console.log('查询字段'+this.currentRow.searchFields)
            //右侧表格字段数据
          this.getGlobalsearchLayerfields()
          },
          //获取图层数据树形结构
      getLayerTree(){
        this.loadTree = true;
        api.fetchGetLayerTree()
            .then(res=>{
                 this.loadTree = false
                 console.log(res.data)
                 this.layerTree = res.data

            })
      },
          //新增
          addMap(){
            this.addMapLayers = true;
            this.getLayerTree()
          },
          layerTreeNodeClick(){

          },
          addMapLayersSubmit(){

          },

          //删除选中的记录
          delGlobalsearch(){
            let data ={
              rid:this.SublayerRid
            }
            api.fetchGetGlobalsearchDelete({params:data})
              .then(res=>{
                console.log(res)
              })
          },
      }
  }
</script>