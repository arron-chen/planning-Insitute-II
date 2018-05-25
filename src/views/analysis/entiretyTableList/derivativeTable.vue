<template>
	<div class='derivative-table' id="derivativeTable">
	<div class="search-item" style="border: 1px solid #dbe3e7;border-radius: 4px">
		<el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="年份" style="float:left;margin-bottom:8px;">
          		<el-select v-model="form.year" placeholder="请选择年度" style="width:150px;" size="small" @change=" ">
			  <el-option v-for="(item,index) in nds" :key="index" :label="item" :value="item"></el-option>
          	</el-select>
       	</el-form-item>
        <el-form-item label="数据区划" style="float:left;margin-bottom:8px;">
          <el-select v-model="form.xzdm" placeholder="请选择数据区划" style="width:150px;" size="small" @change=" ">
			  <el-option v-for="(item,key) in sjqh"  :label="item" :key="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇总方案" style="float:left;margin-bottom:8px;margin-left:20px;">
          <el-select v-model="form.tname" placeholder="请选择汇总方案" style="width:150px;" size="small" @change=" ">
				<el-option v-for="(item,index) in hz" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次" style="float:left;margin-bottom:8px;">
          <el-select v-model="form.sjpc" placeholder="请选择批次" style="width:150px;" size="small" @change=" ">
				<el-option v-for="(item,index) in pc" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px" style="float:left;margin-bottom:8px;">
          <el-button type="primary" size="small" @click="submitPro">搜索</el-button>
          <el-button type="primary" size="small" @click="retset">重置</el-button>
        </el-form-item>
      </el-form>
	</div>
		  <div id="derivativeBox" class="panel-content">
				<div data-options="region:'west',split:true,tools:'#derivativeTool'" title="列表" style="width:250px;">
					<el-tree :data="treeData" :props="defaultProps" @node-click="treeNodeClick" v-loading.body="loadTree"></el-tree>
				</div>
         <div id="derivativeTool">
            <a href="javascript:void(0)" class="icon-reload" @click="retset" title="刷新"></a>
          </div>
				<div data-options="region:'center',split:true">
					<div class="tool-box" v-if="toolDisplay">
          				<el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                  <el-button type="primary" size="small" @click="exportExcelMore">批量导出</el-button>
          				<el-button type="primary" size="small" @click="exportTemplate">模板导出</el-button>
          				<el-upload class="upload-demo"
          					action="/mainWeb/ProResult/ImportTemplate"
          					accept=".xlsx"
          					:on-success="isUpload"
          					:on-error="uploadFalse"
          					:data='ProResult'
          					:headers="requertHeader"
          					:before-upload='beforeUpload'
          					:show-file-list="false"
          					>
            				<el-button size="small" type="primary">模板导入</el-button>
          				</el-upload>
          				<el-button type="primary" @click.native.stop="removeReportForm" size="small" v-if="bReport">撤销报表</el-button>
          				<el-button type="primary" @click.native.stop="submitRelease" size="small" v-else="bReport">发布报表</el-button>
          				<el-button type="primary" @click.native.stop="removeTrendChart" size="small" v-if="bTrendChart">撤销趋势</el-button>
          				<el-button type="primary" @click.native.stop="trendRelease" size="small" v-else="bTrendChart">发布趋势</el-button>
							     <el-select v-model="tableunits" placeholder=" " @change="changeSite" style="width:80px;float:right;margin-right:10px;" size="small">
            					<el-option v-for="item in unitlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
          					</el-select>
                    <el-select v-model="level" multiple placeholder="级别" @change="changeSite" style="width:180px;float:right;margin-right:10px;" size="small">
                      <el-option v-for="item in levelList" :key="item" :label="item":value="item">
                      </el-option>
                    </el-select>
          					<el-select v-model="tableXzdm" placeholder="请选择行政区划" @change="changeSite" style="width:150px;float:right;margin-right:10px;" size="small">
            					<el-option v-for="item in xzdmList" :key="item.XZMC" :label="item.XZMC" :value="item.XZDM"  ></el-option>
          					</el-select>
        			</div>
					<div class="table-item" v-if="isTable">
					        <el-table :data="tableData.Rows" border v-loading.body="listLoading" :max-height="260">
					            <el-table-column min-width='130px' v-for="(col,index) in tableData.Cols" :key="index" :prop="col.COLUMN_NAME" :label="col.COMMENTS"></el-table-column>
					        </el-table>
					 </div>
						<div class="table-item" v-else="isTable" style="position:absolute;top:40px;bottom:40px;left:0px;right:0px;overflow:auto">
					        <div class="table-box"  >
					            <div v-html='tableHtml'>
					              	{{tableHtml}}
					           	</div>
					        </div>
					    </div>

                    <div class="page" style="position:absolute;bottom:0px">
                        <el-pagination @size-change="sizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"></el-pagination>
                    </div>
				</div>
<!-- 报表选择发布目录弹窗 start-->
    <el-dialog title="发布报表" :visible.sync="dialogFormVisible3">
      <el-tree :data="ContentsData" v-loading.body="loadTree" :props="defaultProps" :load="loadNode" lazy highlight-current :render-content="renderContent" :expand-on-click-node="false" @node-click="FormTreeNodeClick"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" plain @click="AppendRoot" style="float:left">增加根节点</el-button>
        <el-button @click="closeContent">取 消</el-button>
        <el-button type="primary" @click="saveContent">发 布</el-button>
      </div>
    </el-dialog>
    <!-- 报表选择发布目录弹窗end -->

    <!-- 报表修改节点弹窗 start-->
    <el-dialog title="修改节点" :visible.sync="dialogFormVisible4" size=tiny >
      <el-input size="small" placeholder="请输入节点名称" v-model="TreeLabelName" v-if="flag"></el-input>
      <el-input size="small" placeholder="请输入节点名称" v-model="trendTreeLabelName" v-else="flag"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRevise" size=small>取 消</el-button>
        <el-button type="primary" @click="submitRevise" size=small>确 定</el-button>
      </div>
    </el-dialog>

    <!-- 报表增加节点弹窗 start-->
    <el-dialog title="增加子节点" :visible.sync="dialogFormVisible5" size=tiny >
      <div v-if="flag">
        <el-input size="small" placeholder="请输入子节点名称" v-model="TreeLabelName2"></el-input>
        <el-input size="small" placeholder="请输入子节点相关描述" v-model="TreeLabelDescribe" style="margin-top:12px"></el-input>
      </div>
      <div v-else="flag">
        <el-input size="small" placeholder="请输入子节点名称" v-model="trendTreeLabelName2"></el-input>
        <el-input size="small" placeholder="请输入子节点相关描述" v-model="trendTreeLabelDescribe" style="margin-top:12px"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAppend" size=small>取 消</el-button>
        <el-button type="primary" @click="submitAppend" size=small>确 定</el-button>
      </div>
    </el-dialog>

    <!-- 报表删除节点弹窗 start-->
    <el-dialog title="删除节点" :visible.sync="dialogFormVisible6" size=tiny >
      <p style="color:#ff4949">确定删除节点？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDel" size=small>取 消</el-button>
        <el-button type="primary" @click="submitDel" size=small>确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="发布趋势" :visible.sync="dialogFormVisible7">
      <el-tree :data="trendTree" v-loading.body="loadTrendTree" :props="defaultProps" :load="loadTrendNode" lazy highlight-current :render-content="renderContent" :expand-on-click-node="false" @node-click="trendTreeNodeClick"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" plain @click="AppendRoot" style="float:left">增加根节点</el-button>
        <el-button @click="closeTrendDig">取 消</el-button>
        <el-button type="primary" @click="saveTrendTable">发 布</el-button>
      </div>
    </el-dialog>

     <!-- 报表增加根节点弹窗 start-->
     <el-dialog title="增加根节点" :visible.sync="dialogFormVisible8" size=tiny >
      <div v-if="flag">
        <el-input size="small" placeholder="请输入根节点名称" v-model="TreeLabelName3"></el-input>
        <el-input size="small" placeholder="请输入根节点相关描述" v-model="TreeLabelDescribe2" style="margin-top:12px"></el-input>
      </div>
      <div v-else="flag">
        <el-input size="small" placeholder="请输入根节点名称" v-model="trendTreeLabelName3"></el-input>
        <el-input size="small" placeholder="请输入根节点相关描述" v-model="trendTreeLabelDescribe2" style="margin-top:12px"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="queryAppendRoot" size=small>取 消</el-button>
        <el-button type="primary" @click="submitAppendRoot" size=small>确 定</el-button>
      </div>
    </el-dialog>


		</div>
	</div>
</template>
<script>
 import api from '../../../fetch/index'
 import TreeItem from './treeItem.vue'
export default {
	name: 'derivativeTable',
	data() {
		return {
			toolDisplay:false,
			treeData: [],
			loadTree: false,
			listLoading:false,
			loadTrendTree : false,
			defaultProps: {
				children: 'children',
				label: 'label'
			},
      ProResult:{
        srid:'',
        sType:''
      },
      requertHeader: {
          Authorization: '',
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
             form : {
          		year : '',  //年度
          		xzdm : '',
          		tname : '',
          		sjpc : '',
        	},
        	nds:[],
        	sjqh:[],
        	hz:[],
        	pc:[],
            tableXzdm:'',
        	xzdmList:[],
        	level: ['省','市','县'],
        	levelList:[],
          tableunits:'公顷',
          unitlist: [
            {
                value: '公顷',
                label: '公顷'
            },
            {
            	value: '亩',
                label: '亩'
            },{
            	value: '万亩',
                label: '万亩'
            }],
        showTableRid:'',
        dialogFormVisible3 : false,
        dialogFormVisible4 : false,
        dialogFormVisible5 : false,
        dialogFormVisible6 : false,
        dialogFormVisible7 : false,
        dialogFormVisible8 : false,
        ContentsData : [], //发布报表树
        TreeRidNum : '', //发布报表树选中ID
        TreeLabelName : '', //发布报表树修改的
        TreeLabelName2 : '',	//发布报表树增加的
        TreeLabelName3 :'',
        TreeLabelDescribe : '', //发布报表树节点描述
        TreeLabelDescribe2 : '',
        isTable : true,
        tableHtml : '',
        trendTree : [], //发布趋势树
        trendTreeId : '', //发布趋势树选中ID
        trendTreeLabelName : '', //发布趋势树修改的
        trendTreeLabelName2 : '',  //发布趋势树增加的
        trendTreeLabelName3 :'',
        trendTreeLabelDescribe : '', //发布趋势树节点描述
        trendTreeLabelDescribe2 :'',
        flag: '',
        bReport:'', //是否已发布报表
        bTrendChart:'',//是否已发布趋势
        tableYaer:'',
        serviceUrl:'http://10.0.0.7:8080'
		}
	},
	mounted() {
		this.requertHeader.Authorization = window.localStorage.getItem('token');
		this.$nextTick(()=>{
		//	this.tableHeight = $('#derivativeBox').height()-80
			$('#derivativeBox').layout()
		})
		 this.loadTree = true
		 let SearchDeriveTable = {
		 	sType: 'deriveTable'
		 }
		api.fetchSearchProTable({ params: SearchDeriveTable })
			.then(res => {
				this.loadTree = false
				this.treeData = res.data
				this.Total = res.data.Count
			})
		 //工具栏年份列表
      api.fetchGetProYears()
        .then(res =>{
          this.nds = res.data
        })

      //工具栏数据区划列表
      api.fetchGetProSJQH( )
        .then(res =>{
          this.sjqh = res.data
        })

      //工具栏汇总方案列表
      api.fetchGetProModels( )
        .then(res =>{
          this.hz = res.data
        })

      //工具栏数据批次列表
      api.fetchGetProSJPC( )
        .then(res =>{
          this.pc = res.data
        })
	},
	methods: {
		//搜索汇总表
      submitPro(){
      	 api.fetchGetFiterProTables({params : this.form})
          .then(res =>{
            console.log(res.data)
            this.treeData = res.data
          })
      },
      //重置
      retset(){
        	this.form.year = '',
        	this.form.xzdm = '',
        	this.form.tname = '',
        	this.form.sjpc = '',
        	this.loadTree = true
		 let SearchDeriveTable = {
		 	sType: 'deriveTable'
		 }
		api.fetchSearchProTable({ params: SearchDeriveTable })
			.then(res => {
				this.loadTree = false
				this.treeData = res.data
				this.Total = res.data.Count
			})
    },
		treeNodeClick(eve, node) {
			if (node.isLeaf) {
        console.log('tableunits:'+this.tableunits)
        this.tableYaer = eve.attributes.year,
				this.toolDisplay = true
				this.TreeRidNum = ''
				this.tableName = eve.label
				this.listLoading = true
				this.showTableRid = eve.attributes.rid
				this.tableXzdm = ''
				//获取行政区划
          		let data = {
            		srid : this.showTableRid,
            		sType : 'deriveTable',
          		}
          		api.fetchGetXZDMs({params : data})
            		.then(res =>{
             			if(res.data.code == 102){
                 			this.$message({
                  			showClose : true,
             				message : res.data.message,
                  			type : 'warning'
                		});
              			} else if(res.data.code == 99){
                 			this.$message({
                  			showClose : true,
                  			message :  res.data.message,
                  			type : 'warning'
                			});
              			}else {
                			 this.tableXzdm = res.data[0].XZDM
                			 this.xzdmList = res.data
              			}

             			 //获取行政级别
          			api.fetchGetXZQRange({params : {nf: this.tableYaer}})
            			.then(res =>{
              			this.levelList = res.data
              	 		let showtable = {
							         srid: this.showTableRid,
							         sType:'deriveTable',
							         xzdm : this.tableXzdm,
            	         xzjbs:this.level.toString(),
							         mjdw: this.tableunits,
							         page: this.pageIndex,
							       pageCount: this.pageSize
						      }
					api.fetchSearchShowTableByXZDM({ params: showtable })
						.then(res => {
                     this.tableunits = res.data.DW
							       this.bReport = res.data.bReport
              			 this.bTrendChart = res.data.bTrendChart
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
		//导入模板成功后
      	isUpload(){
        this.$message({
          showClose : true,
          message : '导入成功',
          type : 'success'
        });

                  let showtable = {
                       srid: this.showTableRid,
                       sType:'deriveTable',
                       xzdm : this.tableXzdm,
                       xzjbs:this.level.toString(),
                       mjdw:this.tableunits,
                       page: this.pageIndex,
                     pageCount: this.pageSize
                  }
          api.fetchSearchShowTableByXZDM({ params: showtable })
            .then(res => {
              this.bReport = res.data.bReport
                      this.bTrendChart = res.data.bTrendChart
                 //    this.tableunit = res.data.DW
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
      	},
      	//导入模板失败
      	uploadFalse(){
        this.$message({
          showClose : true,
          message : '导入失败',
          type : 'error'
        });
      	},
		beforeUpload(file){
        	this.ProResult.srid=this.showTableRid
        	this.ProResult.sType='deriveTable'
      	},
	  	//点击发布报表
      	submitRelease : function(){
        	this.flag = true
        	this.dialogFormVisible3 = true
        	//请求报表目录
        	let ExpanseReport = {
          		expanseCata : '',
          		onlyCata : 1
        	}
          api.fetchGetExpanseReportCata(ExpanseReport)
        	//api.fetchGetExpanseReportCata({params : ExpanseReport})
          		.then(res =>{
            	this.loadTree = false
            	this.ContentsData = res.data
          	})
      	},
      	//发布报表树分节点加载
      	loadNode(node, resolve){
        	if(node.id == 0){
          		return false
        	}
        	var result = JSON.stringify(node.data)

        	let ExpanseReport = {
          		expanseCata : result,
          		onlyCata : 1
        	}
          api.fetchGetExpanseReportCata(ExpanseReport)
        //	api.fetchGetExpanseReportCata({params : ExpanseReport})
          		.then(res =>{
            	resolve(res.data.children)
          	})
      	},
      	//发布报表树点击选中
      	FormTreeNodeClick(eve, node){
        	this.TreeLabelName = node.label
        	this.TreeRidNum = eve.rid
      	},
      	//发布报表
      	saveContent(){
        	this.dialogFormVisible3 = false
        	if(!this.showTableRid){
          		this.$message({
            	showClose : true,
            	message : '请选择需要发布的表！',
            	type : 'warning'
          	});
        	} else if(!this.TreeRidNum){
          	this.$message({
            	showClose : true,
            	message : '请选择需要发的节点！',
            	type : 'warning'
          	});
        	} else {
          	let publishTableCata = {
            	srid : this.showTableRid,
            	pid : this.TreeRidNum,
            	sType : 'deriveTable'
          	}
          	api.fetchPublishTable(publishTableCata)
            	.then(res =>{
              	console.log(res.data)
              	if(res.data.rid){
                	this.$message({
                  	showClose : true,
                  	message : '发布成功',
                  	type : 'success'
                	});
                	this.bReport = true
              	} else {
                	this.$message({
                  	showClose : true,
                  	message : res.data.message,
                  	type : 'error'
                	});
              }
            })
        	}
      	},
        //取消发布报表
      	closeContent(){
        	this.dialogFormVisible3 = false
      	},
      	//自定义报表目录树
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
            OpenEdit : (eve) =>{
              this.dialogFormVisible4 = true
            },
            Append : () =>{
              this.dialogFormVisible5 = true
            },
            //删除节点
            Delete : (nodeData) =>{
              this.dialogFormVisible6 = true
            },
          }
        	})
      	},
        //
      AppendRoot:function(){
        this.dialogFormVisible8 = true
      },
      	//刷新报表树
      	refrashTree(){
        	let ExpanseReport = {
          		expanseCata : '',
          		onlyCata : 1
        	}
          api.fetchGetExpanseReportCata(ExpanseReport)
        //	api.fetchGetExpanseReportCata({params : ExpanseReport})
          .then(res =>{
            this.loadTree = false
            this.ContentsData = res.data
            console.log(this.regions);
          })
      	},
      	//撤销已发布报表
      	removeReportForm(){
         this.$confirm('是否撤销报表, 是否继续?', '提示', {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'warning'
          }).then(() =>{
            let data = {
              srid : this.showTableRid
              }
              api.fetchGetRevokePulishTable({params:data})
              .then(res=>{
                if(res.data.code == 200){
                this.$message({
                    showClose : true,
                    message : res.data.message,
                    type : 'success'
                  })
               this.bReport = false
              } else{
                this.$message({
                    showClose : true,
                    message : res.data.message,
                    type : 'warning'
                })
              }
          })
        }).catch(() =>{

        });
      	},

      	//点击发布趋势
      	trendRelease : function(){
        	this.flag = false
        	this.loadTrendTree = true
        	this.dialogFormVisible7 = true
        	//请求趋势目录树
        	this.refrashTrendTree()
      	},
      	//请求趋势目录树
      	refrashTrendTree(){
         	let cata = {
            expanseCata : '',
            onlyCata : 1
          }
          api.fetchGetTrendChartCata({params : cata})
           .then(res =>{
              console.log(res.data)
              this.loadTrendTree = false
              this.trendTree = res.data
           })
      	},
      	//趋势目录树分节点加载
      	loadTrendNode(node, resolve){
        	if(node.id == 0){
          		return false
        	}
        	var result = JSON.stringify(node.data)
        	let cata = {
          		expanseCata : result,
          		onlyCata : 1
        	}
        	api.fetchGetTrendChartCata({params : cata})
           		.then(res =>{
              		resolve(res.data.children)
           	})
      	},
      	//趋势目录树点击选中
      	trendTreeNodeClick(eve, node){
        	this.trendTreeLabelName = node.label
        	this.trendTreeId = eve.rid
      	},
      	//发布趋势
      	saveTrendTable(){
        	this.dialogFormVisible7 = false
         	if(!this.showTableRid){
          	this.$message({
            	showClose : true,
           	 	message : '请选择需要发布的表！',
            	type : 'warning'
          	});
        	} else if(!this.trendTreeId){
          	this.$message({
            	showClose : true,
            	message : '请选择需要发的节点！',
            	type : 'warning'
          	});
        	} else {
          		let publishTableCata = {
            		srid : this.showTableRid,
            		pid : this.trendTreeId,
            		sType : 'deriveTable'
          	}
          	api.fetchGetPublishTrendChart(publishTableCata)
            .then(res =>{
              console.log(res.data)
              if(res.data.rid){
                this.$message({
                  showClose : true,
                  message : '发布成功',
                  type : 'success'
                });
                this.bTrendChart = true
              } else {
                this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'error'
                });
              }
            })
       	 }
      	},
      	//取消趋势发布
      	closeTrendDig(){
        	this.dialogFormVisible7 = false
      	},
      	//撤销已发布趋势
      	removeTrendChart(){
         this.$confirm('是否撤销趋势, 是否继续?', '提示', {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'warning'
          }).then(() =>{
              let data = {
            srid : this.showTableRid
          }
          api.fetchGetRevokePulishTrendChart({params:data})
          .then(res=>{
            if(res.data.code == 200){
              this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'success'
                })
              this.bTrendChart = false
            } else{
               this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'warning'
                })
            }
          })
        }).catch(() =>{

        });
      	},

      	//取消节点修改
      	cancelRevise : function(){
        	this.dialogFormVisible4 = false;
      	},
      	//确定节点修改
      	submitRevise : function(){
        	if(this.flag == true){
           	//修改报表树
            let RenameReportCata = {
              rid : this.TreeRidNum,
              rename : this.TreeLabelName,
            }
            api.fetchGetRenameReportCata({params : RenameReportCata})
              .then(res =>{
                if(res.data.rid){
                  this.$message({
                    showClose : true,
                    message : '修改节点成功',
                    type : 'success'
                  });
                this.dialogFormVisible4 = false;
                //刷新报表树
                this.refrashTree();
                } else {
                  this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'error'
                });
                this.dialogFormVisible4 = false;
              }
            })
        	} else if(this.flag == false) {
          //修改趋势树
           let RenameReportCata = {
              rid : this.trendTreeId,
              rename : this.trendTreeLabelName,
            }
            console.log(RenameReportCata)
           api.fetchGetTrendChartRename({params : RenameReportCata})
            .then(res =>{
                if(res.data.rid){
                  this.$message({
                    showClose : true,
                    message : '修改节点成功',
                    type : 'success'
                  });
                this.dialogFormVisible4 = false;
                //刷新趋势树
                 this.refrashTrendTree();
                } else {
                  this.$message({
                  showClose : true,
                  message : '修改节点失败',
                  type : 'error'
                });
                this.dialogFormVisible4 = false;
              }
            })
        	}
      	},
        //取消增加根节点
      queryAppendRoot : function(){
         this.dialogFormVisible8 = false
      },
      //确定增加根节点
      submitAppendRoot : function(){
           if(this.flag == true){
               let AddReportCata = {
                pid : '',
                name : this.TreeLabelName3,
                desc : this.TreeLabelDescribe2,
              }
              api.fetchGetAddReportCata({params : AddReportCata})
                .then(res =>{
                    if(res.data.rid){
                    this.$message({
                      showClose : true,
                      message : '增加节点成功',
                      type : 'success'
                    });
                    this.dialogFormVisible8 = false;
                    //刷新报表树
                    this.refrashTree();
                    } else {
                    this.$message({
                      showClose : true,
                      message : res.data.message,
                      type : 'error'
                    });
                    this.dialogFormVisible8 = false;
                  }
                })
           } else {
            let AddReportCata = {
              pid :  '',
              name : this.trendTreeLabelName3,
              desc : this.trendTreeLabelDescribe2,
            }
            api.fetchGetTrendChartAddReportCata({params : AddReportCata})
              .then(res =>{
                if(res.data.rid){
                  this.$message({
                    showClose : true,
                    message : '增加根节点成功',
                    type : 'success'
                  });
                  this.dialogFormVisible8 = false;
                  //刷新趋势树
                  this.refrashTrendTree();
                } else {
                  this.$message({
                    showClose : true,
                    message : '增加根节点失败',
                    type : 'error'
                  });
                  this.dialogFormVisible8 = false;
                }
            })
           }
      },


      	//取消增加子节点
      	cancelAppend : function(){
        	this.dialogFormVisible5 = false
     	 },
      	//确定增加子节点
      	submitAppend : function(){
        	if(this.flag == true){
          	let AddReportCata = {
            pid : this.TreeRidNum,
            name : this.TreeLabelName2,
            desc : this.TreeLabelDescribe,
          	}
          	api.fetchGetAddReportCata({params : AddReportCata})
            .then(res =>{
              if(res.data.rid){
                this.$message({
                  showClose : true,
                  message : '增加节点成功',
                  type : 'success'
                });
                this.dialogFormVisible5 = false;
                //刷新报表树
                this.refrashTree();
                } else {
                this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'error'
                });
                this.dialogFormVisible5 = false;
              }
          })
        	}else if(this.flag == false){
           let AddReportCata = {
              pid :  this.trendTreeId,
              name : this.trendTreeLabelName2,
              desc : this.trendTreeLabelDescribe,
            }
            api.fetchGetTrendChartAddReportCata({params : AddReportCata})
              .then(res =>{
                if(res.data.rid){
                  this.$message({
                    showClose : true,
                    message : '增加节点成功',
                    type : 'success'
                  });
                  this.dialogFormVisible5 = false;
                  //刷新趋势树
                  this.refrashTrendTree();
                } else {
                  this.$message({
                    showClose : true,
                    message : '增加节点失败',
                    type : 'error'
                  });
                  this.dialogFormVisible5 = false;
                }
            })
        	}
      	},
      	//取消删除节点
      	cancelDel : function(){
        	this.dialogFormVisible6 = false
      	},
      	//确定删除节点
      	submitDel : function(){
        	if(this.flag == true){
          let RemoveReportCata = {
            rid : this.TreeRidNum,
          }
          api.fetchGetRemoveReportCata({params : RemoveReportCata})
            .then(res =>{
              if(res.data.code == 200){
                this.$message({
                  showClose : true,
                  message : '删除节点成功',
                  type : 'success'
                });
                this.dialogFormVisible6 = false;
                //刷新报表树
                this.refrashTree();
              } else {
                this.$message({
                  showClose : true,
                  message : '删除节点失败',
                  type : 'error'
                });
                this.dialogFormVisible6 = false;
              }
          })
        	} else if(this.flag == false){
            let RemoveReportCata = {
              rid : this.trendTreeId,
            }
            api.fetchGetTrendChartRemoveReportCata({params : RemoveReportCata})
              .then(res =>{
                if(res.data.code == 200){
                  this.$message({
                    showClose : true,
                    message : '删除节点成功',
                    type : 'success'
                  });
                  this.dialogFormVisible6 = false;
                  //刷新趋势树
                  this.refrashTrendTree();
                  } else {
                  this.$message({
                    showClose : true,
                    message : '删除节点失败',
                    type : 'error'
                  });
                  this.dialogFormVisible6 = false;
                }
            })
        	}
      	},

		//模板导入
		 importTemplate:function(){
		 	alert('模板导入')
		 },


		//打印
		printTable:function(){
			alert('打印')
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
            		sType : 'deriveTable',
                xzdm : this.tableXzdm,
                xzjbs:this.level.toString(),
                mjdw:this.tableunits,
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
            			window.location.href = this.serviceUrl+"/mainWeb" + res.data + ""
            		}

            	})
        	}
      	},
      //批量导出
      exportExcelMore:function(){

        if(this.showTableRid == ''){
              this.$message({
                showClose : true,
                message : '请选择需要导出的表！',
                type : 'warning'
              });
            } else {
            let exportTable = {
                srid : this.showTableRid,
                sType : 'deriveTable',
              }
              api.fetchBatchExportExcel({params : exportTable})
                .then(res =>{
                if(res.data.message){
                 this.$message({
                    showClose : true,
                    message : res.data.message,
                    type : 'error'
                  });
                } else{
                  window.location.href = this.serviceUrl+"/mainWeb" + res.data + ""
                }
              })
          }


      },
      	//模板导出
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
            		sType : 'deriveTable',
          	}
         	 api.fetchGetExportTemplate({params : ImportTemplate})
            	.then(res =>{
              		window.location.href = this.serviceUrl+"/mainWeb" + res.data + ""
            	})
        	}
      	},

		//
		changeSite:function(){
			this.listLoading = true
			let showtable = {
					srid: this.showTableRid,
					sType:'deriveTable',
					xzdm : this.tableXzdm,
          xzjbs:this.level.toString(),
					mjdw:this.tableunits,
					page: this.pageIndex,
					pageCount: this.pageSize
				}
				api.fetchSearchShowTableByXZDM({ params: showtable })
					.then(res => {
             			//	 this.tableunit = res.data.DW
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
		},
		//分页
		sizeChange: function(pageSize) {
            this.pageSize = pageSize;

            this.listLoading = true
			let showtable = {
					srid: this.showTableRid,
					sType:'deriveTable',
					xzdm : this.tableXzdm,
          xzjbs:this.level.toString(),
					mjdw:this.tableunits,
					page: this.pageIndex,
					pageCount: this.pageSize
				}
				api.fetchSearchShowTableByXZDM({ params: showtable })
					.then(res => {
						console.log(res.data)
             	//			 this.tableunit = res.data.DW
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
        },
        pageIndexChange: function(pageIndex) {
        	this.pageIndex = pageIndex
            this.listLoading = true
			let showtable = {
					srid: this.showTableRid,
					sType:'deriveTable',
					xzdm : this.tableXzdm,
          xzjbs:this.level.toString(),
					mjdw:this.tableunits,
					page: this.pageIndex,
					pageCount: this.pageSize
				}
				console.log('showtable: '+showtable.mjdw)
				api.fetchSearchShowTableByXZDM({ params: showtable })
					.then(res => {

             //				 this.tableunit = res.data.DW
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
		},
	}
}
</script>
