<template>
	<div class='transition-table' id="transitionTable">
		<div class="search-item" style="border: 1px solid #dbe3e7;border-radius: 4px"> 
			   	<el-form   label-width="80px">
			   		<el-form-item  label="表名" style="float:left;margin-bottom:8px;">
			 				<el-input   placeholder="请输入内容"></el-input> 
			 		</el-form-item>
			 		<el-form-item label-width="10px" style="float:left;margin-bottom:8px;">  
                    	<el-button type="primary" size="small" >搜索</el-button>
                	</el-form-item>
			   	</el-form>
		</div> 
		  <div id="transitionBox" class="panel-content">
				<div data-options="region:'west',split:true,tools:'#transitionTool'" title="列表" style="width:250px;">
					<el-tree :data="treeData" :props="defaultProps" @node-click="treeNodeClick" v-loading.body="loadTree"></el-tree>
				</div>
        <div id="transitionTool">
            <a href="javascript:void(0)" class="icon-reload" title="刷新"></a>
          </div>
				<div data-options="region:'center',split:true">
					<div class="tool-box">
						<el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                  		<el-button type="primary" size="small">模板导入</el-button>
                  		<el-button type="primary" size="small" @click="exportTemplate">模板导出</el-button>
                  	<!--   <el-button type="primary" size="small">打印</el-button> -->
                  		<el-button type="primary" @click.native.stop=" " size="small" id="submit">发布</el-button>
                  		<el-select v-model="tableunit" placeholder=" " @change=" "  style="width:95px;float:right;margin-right:10px;" size="small" >
                        <el-option v-for="item in unitlist" :key="item.value" :label="item.label" :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                  </el-select>

                   <el-select v-model="level" placeholder="级别" @change="changeSite" style="width:140px;float:right;margin-right:10px;" size="small"> 
              <el-option v-for="(item,key) in levelList" :key="item" :label="item" :value="key"  ></el-option>
          </el-select>
          <el-select v-model="tableXzdm" placeholder="请选择行政区划" @change="changeSite" style="width:150px;float:right;margin-right:10px;" size="small">
            <el-option v-for="item in xzdmList" :key="item.XZMC" :label="item.XZMC" :value="item.XZDM"  ></el-option>
          </el-select>

					</div>
					<div class="table-item">
						 <el-table :data="tableData.Rows" border  v-loading.body="listLoading" :max-height="260">
                             <el-table-column min-width='130px' v-for="(col,index) in tableData.Cols" :key="index" :prop="col.COLUMN_NAME" :label="col.COMMENTS"> </el-table-column>  
                        </el-table>
					</div>
                    <div class="page">
                        <el-pagination @size-change="sizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"></el-pagination>
                    </div>
				</div>
		</div>
	</div>
</template>  
<script>
 import api from '../../../fetch/index'
export default {
	name: 'derivativeTable',
	data() {
		return {
			treeData: [],
			loadTree: false,
			listLoading:false,
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			tableData: [],
			tableHeight:'',
			tags: [
                { name: '标签一', type: '' },
                { name: '标签二', type: 'gray' }, 
 
            ],
            pageIndex: 1,
            pageSize: 20,
            pageSizes: [20, 50, 100, 200,500],
            Total:0,

            tableunit:'公顷',
            unitlist: [{
                value: '公顷',
                label: '公顷'
            },
            {
            	value: '平方米',
                label: '平方米'
            },{
            	value: '亩',
                label: '亩'
            },{
            	value: '万亩',
                label: '万亩'
            }],
            tableXzdm:'',
       	 	xzdmList:[],
        	level:'',
        	levelList:[],
        	showTableRid:'',
            
            
		}
	},
	mounted() {
		this.$nextTick(()=>{
		//	this.tableHeight = $('#transitionBox').height()-80
			$('#transitionBox').layout()
		})
		 this.loadTree = true
		 let SearchDeriveTable = {
		 //	sType: 'tmpTable'
		 	sType: 'tmpTable'
		 }
		api.fetchSearchProTable({ params: SearchDeriveTable })
			.then(res => {
				this.loadTree = false
				this.treeData = res.data	
				this.Total = res.data.Count 	 
			}) 
	},
	methods: {
		//左侧树节点点击
      	treeNodeClick(eve, node){
        	if(node.isLeaf){
          		this.TreeRidNum = ''
          		this.tableName = eve.label
          		this.listLoading = true
         	    this.showTableRid = eve.attributes.rid
          		this.tableXzdm = ''
          		//获取行政区划 
          		let data = {
            		srid : this.showTableRid,
            		sType : 'tmpTable',
          			}
          	api.fetchGetXZDMs({params : data})
            .then(res =>{   
              console.log(res.data)
              if(res.data.code == 102){
                 this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'warning'
                });
              } else if(res.data.code == 99){
                 this.$message({
                  showClose : true,
                  message : '无行政区相关数据',
                  type : 'warning'
                });
              } else {
                this.tableXzdm = res.data[0].XZDM
                this.xzdmList = res.data
              }

              //获取行政级别
              api.fetchGetShowXZJB()
                .then(res =>{
                  this.levelList = res.data
                  this.level = '2'

                let showtable = {
                  srid : this.showTableRid,
                  sType : 'tmpTable',
                  mjdw : this.tableunit,
                  xzdm : this.tableXzdm,
                  showJB : this.level,
                  page : this.pageIndex,
                  pageCount : this.pageSize
                }
 
            api.fetchSearchShowTableByXZDM({params : showtable})
            .then(res =>{
              this.tableunit = res.data.DW
              if(res.data.html != ''){
                this.isTable = false;
                this.tableHtml = res.data.html
              } else {
                this.isTable = true;
                this.tableData = res.data;
              }
              this.listLoading = false
              this.Total = res.data.Count
            })

            })

          })
        	} 
      	},
	    //表格设置切换
    	changeSite : function(){
        	this.listLoading = true
        	let showtable = {
         	  srid : this.showTableRid,
          	sType : 'tmpTable',
          	xzdm : this.tableXzdm,
          	showJB : this.level,
          	mjdw : this.tableunit,
          	page : this.pageIndex,
          	pageCount : this.pageSize 
        	}
         api.fetchSearchShowTableByXZDM({params : showtable})
          .then(res =>{
            this.tableData = res.data;
            this.listLoading = false
            this.Total = res.data.Count
          }) 
      	},
      	//导出
      	exportExcel : function(){
        	if(this.showTableRid == ''){
          		this.$message({
            		showClose : true,
            		message : '请选择需要导出的表！',
            		type : 'warning'
          		});
        	} else {
          		let exportTable = {
            	srid : this.showTableRid,
            	sType : 'tmpTable',
          		}
          		api.fetchGetExportExcel({params : exportTable})
            		.then(res =>{
            	 	if(res.data.message){
            		 		this.$message({
               		 		showClose : true,
                			message : res.data.message,
                			type : 'error'
              			});
            		} else{
            		window.location.href = "http://10.0.0.7:8080/mainWeb" + res.data + ""
            		}
            	})
        	}
      	},
      	//导出模板
      	exportTemplate(){
        	if(this.showTableRid == ''){
          		this.$message({
            		showClose : true,
            		message : '请选择需要导出的表！',
            		type : 'warning'
          		});
        	} else {
          	let ImportTemplate = {
            	srid : this.showTableRid,
            	sType : 'tmpTable',
          	}
          	api.fetchGetExportTemplate({params : ImportTemplate})
            	.then(res =>{
              		window.location.href = "http://10.0.0.7:8080/mainWeb" +res.data + ""
            	})
        	}
      	},



		//分页 
		sizeChange : function(pageSize){
        	this.pageSize = pageSize;
        	this.listLoading = true
        	let showtable = {
          	srid : this.showTableRid,
          	sType : 'tmpTable',
          	xzdm : this.tableXzdm,
          	showJB : this.level,
          	mjdw : this.tableunit,
          	page : this.pageIndex,
          	pageCount : this.pageSize
        	}
        	api.fetchSearchShowTableByXZDM({params : showtable})
          	.then(res =>{
            	this.tableData = res.data;
            	this.listLoading = false
            	this.Total = res.data.Count
          })
      	},
      	pageIndexChange : function(pageIndex){
        	this.pageIndex = pageIndex
        	this.listLoading = true
        	let showtable = {
          	srid : this.showTableRid,
          	sType : 'tmpTable',
         	xzdm : this.tableXzdm,
          	showJB : this.level,
          	mjdw : this.tableunit,
         	page : this.pageIndex,
          	pageCount : this.pageSize
        	}
        	api.fetchSearchShowTableByXZDM({params : showtable})
          	.then(res =>{
            	this.tableData = res.data;
            	this.listLoading = false
            	this.Total = res.data.Count
          })
      	},
	}
} 
</script>