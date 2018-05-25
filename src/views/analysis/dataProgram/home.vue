<template>
	<div>
		<el-button type="primary" size="mini"  @click="addTask" style="float:right;margin:3px">新任务</el-button>
    <el-button type="primary" size="mini" style="float:right;margin:3px" @click="getAllTasks">刷新</el-button>
    <div class="taskListOne" style="margin-top: 62px">
		<el-table :data="tableData" border :max-height="400">
        <el-table-column prop="xzqLabel" label="行政区划"></el-table-column>
        <el-table-column prop="year" label="任务年度"></el-table-column>
        <el-table-column prop="firstYear" label="起始年度"></el-table-column>
        <el-table-column prop="dataTimes" label="数据批次"></el-table-column>
        <el-table-column prop="startTime" :formatter="formatter" label="开始时间"></el-table-column>
        <el-table-column prop="finishTime" :formatter="formatter" label="结束时间"></el-table-column>
        <el-table-column prop="progress" label="进度"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status|status(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="Details(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="reloadTask(scope.$index,scope.row)" :disabled='Boolean(scope.row.status<=0)'
                       plain>重新执行
            </el-button>
            <el-button size="mini" type="danger" @click="stopTask(scope.$index,scope.row)"
                       :disabled='Boolean(scope.row.status!==0&&scope.row.status>0)' plain>停止
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-table"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="toolsList.currentPage"
        :page-sizes="[10, 20, 50,100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="toolsList.total">
      </el-pagination>
    </div>
      <!-- 数据处理任务 -->
    <el-dialog title="数据处理任务" :visible.sync="addProgram" size="tiny">
     <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="任务年度">
          <el-select v-model="modelYears" placeholder="请选择" @visible-change="getTaskParaYears"
                     @change="getOtherInfo" style="display:block">
            <el-option
              v-for="(item,index) in years"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="起始年度">
          <el-select v-model="paraYearsVal" :disabled="isDisabled" placeholder="请选择" style="display:block">
            <el-option
              v-for="(item,index) in paraYears"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="行政区划">
          <el-cascader
            :options="paraXZQs"
            v-model="paraXZQsVal"
            :disabled="isDisabled"
            :props='props'
            :change-on-select="true"
            :show-all-levels="false"
            style="display:block"
          >
          </el-cascader>
        </el-form-item>

      <el-form-item label="数据批次">
          <el-select v-model="paraSJPCVal" :disabled="isDisabled" placeholder="请选择" style="display:block">
            <el-option
              v-for="(item,index) in paraSJPC"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="description" placeholder="请输入内容" :disabled="isDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click='save' :loading="loadTask">{{loadText}}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
    import dateFormat from "@/tools/date/format.js";
	import api from "../../../fetch/index";
   export default{
   	data(){
   		return{

   			modelRid:'',
   			tableData:[],
   			toolsList:{
          		currentPage:1,
          		pageRows:2,
          		total:null
        	},
        	addProgram: false,
        	form: {
         		 modelRid: "",
         		 year: "",
          		firstYear: "",
          		xzqdm: "",
          		dataTimes: "",
          		description: ''
        	},
        	loadTask: false,
        	loadText: "确定",
        	isDisabled: true,//默认禁用状态
        	years: [],  //任务年度列表
        	modelYears: '', //任务年度值
        	paraYears: [],//起始年度
        	paraYearsVal: '', //起始年度值
        	paraXZQs: [],//行政区划
        	paraXZQsVal: '', //行政区划值
        	props: {
          		value: 'text',
          		label: 'label',
        	},
        	paraSJPC: [],//数据批次
        	paraSJPCVal:[], //数据批次值
        	description: '',
          height:"",
   		}
   	},
   	mounted() {
			this.modelRid = this.$route.query.data;
			this.showAttributes();
      this.height = ($(".taskListOne").height()).toString();
      console.log(this.height)
    },
    filters: {
      status(statu) {
        if (statu == -1) {
          return "未开始";
        }
        if (statu == 0) {
          return "正在运行";
        }
        if (statu == 1) {
          return "成功";
        }
        if (statu == 2) {
          return "失败";
        }
        if (statu == 3) {
          return "已取消";
        }
      },
      xzqh(val) {
        return val.XZQDM + '(' + val.XZQMC + ')'
      }
    },
    watch:{
    	 '$route': function (newQuestion, oldQuestion) {
    	 	this.modelRid = this.$route.query.data;
    	 	this.showAttributes();
    	 }


    },
   	methods:{
   		stopTask(data, node) {
        this.$confirm('目前任务状态为<strong style="color:red">' + '正在执行' + '</strong>, 是否停止任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          this.stopTaskCommit(node)
        }).catch(() => {
        });
      },
       stopTaskCommit(node) {
        let params = {'taskRid': node.rid}
        api.stopTask(params)
          .then(res => {
            if (res.data.code === '200') {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              api
                .getTasksByModel({params: {modelRid: this.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
                .then(res => {
                  if (res.data.code == 200) {
                    if (res.data.message.length == 0) {
                      this.$message("暂无数据");
                      this.toolsList.total = 0;

                    }
                    this.tableData = res.data.message;
                    this.toolsList.total = res.data.total;
                    console.log(this.tableData)
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.message,
                      type: "error"
                    });
                  }
                });
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }
          })
      },
   		addTask() {
        if (this.modelRid == "") {
          this.$message("请选择方案");
          return false;
        } else {
          this.addProgram = true;
          this.modelYears = '';
          this.paraYearsVal = '';
          this.paraXZQsVal = '';
          // this.paraXZQs= '';
          this.paraSJPCVal = [];
          this.description = '';
        }
       },
       //任务年度
      getTaskParaYears(state) {
        if (state === true) {
          api.getTaskParaYears({params: {modelRid: this.modelRid}}).then(res => {
            if (res.data.code == 200) {
            	console.log('2222')
              // this.years = res.data.message[0].split(',')
              this.years = res.data.message
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          });
        }
      },
      getOtherInfo(val) {
        if (val === '') {
          this.isDisabled = true
        } else {
          let params = {
            params: {
              modelRid: this.modelRid,
              taskYear: this.modelYears
            }
          }

          Promise.all([api.getTaskParaStartYears(params), api.getTaskParaXZQs(params), api.getTaskParaSJPC(params)])
            .then(res => {
              this.paraYears = res[0].data.message
              this.paraXZQs = res[1].data.message
              this.paraSJPC = res[2].data.message
              this.isDisabled = false;
            })
        }
      },
      close() {
        this.addProgram = false;
      },
      save() {
        this.loadTask = true;
        this.loadText = "提交中...";
        //获取年度属性
        this.YearStr = "";
        let params = {
          "modelRid": this.modelRid,
          "year": this.modelYears,
          "firstYear": this.paraYearsVal,
          "xzqdm": this.paraXZQsVal[this.paraXZQsVal.length - 1].toString(),
          "dataTimes": this.paraSJPCVal,
          "description": this.description
        }
        api.runTask({task: JSON.stringify(params)}).then(res => {
          api
            .getTasksByModel({params: {modelRid: this.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
            .then(res => {
              if (res.data.code == 200) {
                if (res.data.message.length == 0) {
                  this.$message({
                    type: "error",
                    message: "提交任务失败"
                  });
                  this.toolsList.total = 0;
                  this.loading = false;
                  this.loadTask = false;
                  this.loadTask = false;
                  this.loadText = "确定";
                  return false
                }
                this.tableData = res.data.message;
                this.toolsList.total = res.data.total;
                // this.modelYears = [];
                // this.paraYearsVal = [];
                // this.paraXZQsVal = [];
                // this.paraSJPCVal = [];
                // this.description = [];

                this.addProgram = false;
                this.loading = false;
                this.loadTask = false;
                this.loadTask = false;
                this.loadText = "确定";
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "error"
                });
              }
            });
        });
      },
   		showAttributes() {
        this.toolsList.currentPage = 1;
        this.toolsList.pageRows = 10;
          api
            .getTasksByModel({params: {modelRid: this.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
            .then(res => {
              if (res.data.code == 200) {
                if (res.data.message.length == 0) {
                  this.$message("暂无数据");
                  this.toolsList.total = 0;
                }

                this.tableData = res.data.message;
                console.log(this.tableData)
                this.toolsList.total = res.data.total;
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "error"
                });
              }
            });


      },
      formatter(row, column) {
        var date = row[column.property];
        // console.log(date);
        return dateFormat(date, "YYYY-MM-DD HH:mm:ss");
      },
      Details(a, b) {
      	this.$router.push({'path':'/dataprogram/details',query: { 'data':  b.rid }})
      	this.$store.state.dataProgram.breadcrumbList.push({"label":b.xzqLabel+'('+b.firstYear+'-'+b.year+')'+b.dataTimes,'url':'/dataprogram/details','data':b.rid});
      },
      reloadTask(data, node) {
        let str = ''
        if (node.status === 1) {
          str = '成功'
        } else if (node.status === 0) {
          str = '正在执行'
        } else if (node.status === -1) {
          str = '未开始'
        } else if (node.status === 2) {
          str = '失败'
        } else if (node.status === 3) {
          str = '已取消'
        }
        this.$confirm('目前任务状态为<strong style="color:red">' + str + '</strong>, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          this.reloadTaskCommit(node)
        }).catch(() => {
        });
      },
      getAllTasks() {
        api
          .getTasksByModel({params: {modelRid: this.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
          .then(res => {
            if (res.data.code == 200) {
              if (res.data.message.length == 0) {
                this.$message("暂无数据");
                this.toolsList.total = 0;
              }
              this.tableData = res.data.message;
              this.toolsList.total = res.data.total;
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          });
        /*this.loading = true;
        api.fetchAllTasks().then(res => {
          this.loading = false;
          this.tableData = res.data.message;
        });*/
      },
      reloadTaskCommit(node) {
      	console.log(node)
        let params = {
          "modelRid": this.modelRid,
          "year": node.year,
          "firstYear": node.firstYear,
          "xzqdm": node.xzqdm,
          "dataTimes": node.dataTimes,
          "description": node.description
        }
        api.runTask({task: JSON.stringify(params)}).then(res => {
          api
            .getTasksByModel({params: {modelRid: this.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
            .then(res => {
              if (res.data.code == 200) {
                if (res.data.message.length == 0) {
                  this.$message({
                    type: "error",
                    message: "提交任务失败"
                  });
                  this.toolsList.total = 0;
                 // this.loading = false;

              //    this.loadTask = false;
                  this.loadText = "确定";
                  return false
                }
                this.tableData = res.data.message;
                this.toolsList.total = res.data.total;
                this.addProgram = false;
               // this.loading = false;

               // this.loadTask = false;
                this.loadText = "确定";
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "error"
                });
              }
            });
        });
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.toolsList.pageRows = val;
        this.showModelAttribute();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.toolsList.currentPage = val;
        this.showModelAttribute();
      },
      showModelAttribute(){
        api
          .getTasksByModel({params: {modelRid: this.form.modelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
          .then(res => {
            if (res.data.code == 200) {
              this.tableData = res.data.message;
              this.toolsList.total = res.data.total;
              console.log(this.tableData)
              console.log(res.data.message)
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          });
      },
   	}
   }

</script>
<style lang="less" scoped>
  .pagination-table{
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top: 3px;
  }
  .taskListOne{
    position:absolute;top:0px;bottom:0px;left:0px;right:0px
  }
</style>
