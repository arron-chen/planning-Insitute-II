<template>
  <div id="execution" class="panel-content">
    <div data-options="region:'west',split:true,tools:'#reloadCatalog'" title="任务列表" style="width:250px;overflow:auto">
      <el-tree v-loading.body="loadTree" :data="data2" node-key="id" :highlight-current='true'
               @node-click='showAttributes' :props="defaultProps" :render-content="renderContent" :load="loadNode" lazy ></el-tree>
    </div>
    <div id="reloadCatalog">
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>
    <div data-options="region:'center',split:true" title="任务列表" id="taskList">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding:10px;float:left">

          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" :to="{ path: item.url, query: { data: item.data }}" ><a style="cursor:pointer" @click="routeToPage(item)">{{item.label}}</a></el-breadcrumb-item>
      </el-breadcrumb>
      <div v-show="showView">
            <router-view></router-view>
      </div>
      <!--  <el-tabs class="tabs" v-model="dataProgramActiveTabName" @tab-remove="closeTab" type="card">
            <el-tab-pane v-for="item in dataProgramTabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
              <component :is="item.component"></component>
            </el-tab-pane>
        </el-tabs>   -->
      <!-- <el-table :data="tableData" border v-loading.body="loading" :max-height="height-75">
        <el-table-column prop="xzqLabel" label="行政区划"></el-table-column>
        <el-table-column prop="year" label="任务年度"></el-table-column>
        <el-table-column prop="firstYear" label="起始年度"></el-table-column>
        <el-table-column pop="dataTimes" label="数据批次"></el-table-column>
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
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="toolsList.total">
      </el-pagination> -->

    </div>
   <!--  <div id="reloadAllTasks">
      <a href="javascript:void(0)" class="icon-add" @click="addTask" title="新增"></a>
      <a href="javascript:void(0)" class="icon-reload" @click="getAllTasks" title="刷新"></a>
    </div> -->
    <!-- 子任务 -->
   <!--  <el-dialog :title="dialogtitle" :visible.sync="subTasksVisible" top="5vh" @close='cleanDetails'>

      <el-table :data="subTasks" border v-loading.body="loading" :max-height="height" v-if="!showdetials">
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="startTime" :formatter="formatter" label="开始时间"></el-table-column>
        <el-table-column prop="finishTime" :formatter="formatter" label="结束时间"></el-table-column>
        <el-table-column prop="progress" label="进度"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status | status(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="childDetails(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table> -->
     <!--  <div v-else>
        <el-table :data="subTasksDetail" border :max-height="height" v-loading.body="detailloading">

          <el-table-column prop="xzqLabel" label="行政区划"></el-table-column>
          <el-table-column prop="year" label="年度"></el-table-column>
          <el-table-column prop="dataTimes" label="批次"></el-table-column>
          <el-table-column prop="startTime" :formatter="formatter" label="开始时间"></el-table-column>
          <el-table-column prop="finishTime" :formatter="formatter" label="结束时间"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column label="日志">
            <template slot-scope="scope">
              <el-button @click="childDetailslogs(scope.row.message)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="实际参数">
            <template slot-scope="scope">
              <el-button @click="childDetailsValues(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top:12px;overflow:auto">
          <el-button type="primary" @click="backsubTasks" style="float:right">返回</el-button>
        </div>
      </div> -->
     <!--  <el-dialog width="60%" :visible.sync="innerVisible" append-to-body title="日志详情">
        <div v-html="detiallogs"></div>
      </el-dialog> -->
     <!--  <el-dialog width="60%" :visible.sync="innerVisible2" append-to-body title="实际参数"> -->
        <!-- <div>
            <el-form ref="form" :model="valueslistform"  >
             <el-form-item :label="key" v-for="(value,key) in valueslist" style="margin-bottom: 0px;border:1px solid;border-top:none;">
                    <span> {{value}}</span>
                 </el-form-item>
             </el-form>
            <table class="valueslist-table">
            <tr v-for="(value,key) in valueslist">
              <td>{{key}}</td>
              <td>{{value}}</td>
            </tr>
          </table>
        </div> -->
        <!-- <el-table :data="valueslist" style="width: 100%">
            <el-table-column  prop="value" :label="key"   v-for="(value,key) in valueslist">
            </el-table-column>
        </el-table> -->
    <!--   </el-dialog>
      <el-pagination
        class="pagination-table"
        @size-change="taskListSizeChange"
        @current-change="taskListCurrentChange"
        :current-page="taskList.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="taskList.total"
        v-if="!showdetials">
      </el-pagination>
      <div v-else>
        <el-pagination
          class="pagination-table"
          @size-change="subtaskListSizeChange"
          @current-change="subtaskListCurrentChange"
          :current-page="subtaskList.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="subtaskList.total">
        </el-pagination>
      </div>
    </el-dialog> -->
    <!-- 数据处理任务 -->
    <!-- <el-dialog title="数据处理任务" :visible.sync="addProgram" size="tiny">
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
    </el-dialog> -->


  </div>
</template>
<script>
  import api from "../../fetch/index";

  import dateFormat from "@/tools/date/format.js";
  import treeItem from "../../components/noTreeItem";
  import {mapMutations, mapGetters} from 'vuex'
  var upDataAllTasks;
  export default {
    data() {
      return {
        isDisabled: true,//默认禁用状态
        years: [],  //任务年度列表
        modelYears: [], //任务年度值
        paraYears: [],//起始年度
        paraYearsVal: [], //起始年度值
        paraXZQs: [],//行政区划
        paraXZQsVal: [], //行政区划值
        props: {
          value: 'text',
          label: 'label'
        },
        paraSJPC: [],//数据批次
        paraSJPCVal: [], //数据批次值
        description: '',
        data2: [],
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf:"isLeaf"
        },
        loadTree: false,
        smartbiSrc: "",
        tableData: [],
        loading: false,
        endTime: "",
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
        height: " ",
        subTasks: [],
        subTasksVisible: false,
        tempModelRid: "",
        showdetials: false,
        dialogtitle: '子任务',
        subTasksDetail: [],
        detailloading: false,
        innerVisible: false,
        innerVisible2: false,
        detiallogs: '',
        valueslist: '',
        valueslistform: {},
        toolsList:{
          currentPage:1,
          pageRows:2,
          total:null

        },
        taskList:{
          currentPage:1,
          pageRows:2,
          prid:'',
          total:null
        },
        subtaskList:{
          currentPage:1,
          pageRows:2,
          taskID:'',
          total:null
        },
        breadcrumbList:[],
        showView:false
      };
    },
    components: {
      treeItem
    },

    watch:{
      '$route': function (newQuestion, oldQuestion) {
        console.log(this.$store.state.dataProgram.breadcrumbList)
        this.breadcrumbList =  this.$store.state.dataProgram.breadcrumbList
       }
    },
    methods: {
      routeToPage(item){
        let array = this.$store.state.dataProgram.breadcrumbList
       for(var i=0;i<array.length;i++){
        if(array[i].data == item.data){
          var a =i+1
          var b =array.length - a
           array.splice(a,b)
            console.log(array)
        }
       }

      },
      //push breadcrumbList
      pushBreadcrumbList(item){
        this.$store.state.dataProgram.breadcrumbList.push(item)
        this.breadcrumbList =  this.$store.state.dataProgram.breadcrumbList
      },
      //重新执行任务
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
      reloadTaskCommit(node) {
        let params = {
          "modelRid": this.tempModelRid,
          "year": node.year,
          "firstYear": node.firstYear,
          "xzqdm": node.xzqdm,
          "dataTimes": node.dataTimes,
          "description": node.description
        }
        api.runTask({task: JSON.stringify(params)}).then(res => {
          api
            .getTasksByModel({params: {modelRid: this.tempModelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
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
                .getTasksByModel({params: {modelRid: this.tempModelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
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
      showAttributes(data, node) {
        this.form.modelRid = data.attributes.rid;
        this.tempModelRid = "";
        this.toolsList.currentPage = 1;
        this.toolsList.pageRows = 10;
        if (node.isLeaf) {
          this.showView = true;
          this.tempModelRid = data.attributes.rid;
          this.$store.state.dataProgram.breadcrumbList = []
          this.breadcrumbList =  this.$store.state.dataProgram.breadcrumbList
          this.pushBreadcrumbList({'label':data.label,'url':'/dataprogram/home','data':data.attributes.rid})
          this.$router.push({'path':'/dataprogram/home',query: { 'data': data.attributes.rid }})

        } else {
          return false;
        }
      },
      /*...mapMutations({
        openTab : 'SET_DATAPROGRAMADDTAB'
      }),
      ...mapMutations({
        closeTab : 'SET_DATAPROGRAMCLOSETAB'
      }),*/
      addTask() {
        if (this.tempModelRid == "") {
          this.$message("请选择方案");
          return false;
        } else {
          this.addProgram = true;
          this.modelYears = [];
          this.paraYearsVal = [];
          this.paraXZQsVal = [];
          this.paraSJPCVal = [];
          this.description = '';
        }
      },
      //任务年度
      getTaskParaYears(state) {
        if (state === true) {
          api.getTaskParaYears({params: {modelRid: this.tempModelRid}}).then(res => {
            if (res.data.code == 200) {
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

     /* getOtherInfo(val) {
        if (val === '') {
          this.isDisabled = true
        } else {
          let params = {
            params: {
              modelRid: this.tempModelRid,
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
      },*/
     /* close() {
        // this.modelYears = [];
        // this.paraYearsVal = [];
        // this.paraXZQsVal = [];
        // this.paraSJPCVal = [];
        // this.description = [];
        this.addProgram = false;
      },*/
      /*save() {
        this.loadTask = true;
        this.loadText = "提交中...";
        //获取年度属性
        this.YearStr = "";
        let params = {
          "modelRid": this.tempModelRid,
          "year": this.modelYears,
          "firstYear": this.paraYearsVal,
          "xzqdm": this.paraXZQsVal[this.paraXZQsVal.length - 1].toString(),
          "dataTimes": this.paraSJPCVal,
          "description": this.description
        }
        api.runTask({task: JSON.stringify(params)}).then(res => {
          api
            .getTasksByModel({params: {modelRid: this.tempModelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
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
      },*/
      formatter(row, column) {
        var date = row[column.property];
        // console.log(date);
        return dateFormat(date, "YYYY-MM-DD HH:mm:ss");
      },
      //拼接年度
      setYearStr(e, name) {
        if (this.YearStr == "") {
          this.YearStr += name + ":" + e;
        } else {
          this.YearStr += ";" + name + ":" + e;
        }
      },
      getCatalog() {
        this.loadTree = true;
        try
        {
          api.dataDetCatalog().then(res => {
            if (res.data.code == 200) {

              this.loadTree = false;
              //console.log('-->'+JSON.stringify(res.data));
              this.data2 = res.data.message;
            }
          });
        }
        catch(err)
        {
          console.log(err);
          this.$message({
           // showClose: true,
            message: err,
            type: "error"
          });
          this.loadTree = false;
        }

      },
      getAllTasks() {
        api
          .getTasksByModel({params: {modelRid: this.tempModelRid,page:this.toolsList.currentPage,rows:this.toolsList.pageRows}})
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
      /*Details(a, b) {
        this.taskList.total = 0;
        this.taskList.currentPage = 1;
        this.taskList.pageRows = 10;
        this.showdetials = false;
        this.dialogtitle = '子任务'
        this.subTasksVisible = true;
        this.taskList.prid = b.rid;
        let params = {prid: this.taskList.prid,page:this.taskList.currentPage,rows:this.taskList.pageRows};
        api.getSubTasks({params: params}).then(res => {
          if (res.data.code == 200) {
            if (res.data.message.length == 0) {
             // this.$message("暂无数据");
              this.taskList.total = 0;
            }
            this.subTasks = res.data.message;
            this.taskList.total = res.data.total;
          }
        });
      },*/

      cleanDetails() {
        this.subTasks = [];
      },
      renderContent(h, {node, data, store}) {
        return h(treeItem, {
          props: {
            value: data,
            treeNode: node
          }
        });
      },
      //获取子任务详情
      childDetails(a, b) {
        // console.log(b)
        this.subtaskList.total = 0;
        this.subtaskList.currentPage = 1;
        this.subtaskList.pageRows = 10;
        this.showdetials = true;
        this.dialogtitle = '子任务详情'
        this.detailloading = true;
        this.subtaskList.taskID = b.rid;
        let data = {taskID: this.subtaskList.taskID,page:this.subtaskList.currentPage,rows:this.subtaskList.pageRows};
        api.getTaskJobXZQs({params: data}).then(res => {
          // console.log(res.data.message)
          this.subTasksDetail = res.data.message;
          this.subtaskList.total = res.data.total;
          this.detailloading = false
          /*if (res.data.code == 200) {
             console.log(res.data)
          }*/
        })
      },
      backsubTasks() {
        this.showdetials = false;
        this.dialogtitle = '子任务'
      },
      childDetailslogs(a) {
        this.innerVisible = true;
        this.detiallogs = '';
        if (a === null) {
          return false
        }
        a = a.replace(/\r\n/g, "<br>")
        a = a.replace(/\n/g, "<br>");
        this.detiallogs = a
      },
      childDetailsValues(b) {
        this.innerVisible2 = true;
        api.getJobParavalues({params: {jobid: b.jobRid}})
          .then(res => {
            //console.log(res.data.message)
            this.valueslist = res.data.message
          })
      },
     /* loadNode(node,resolve){
        console.log(node);
        if(node.id==0){
          return false;
        }
        console.log(node.data.id);
        api.getToolBagTree({params : {prid:node.data.id}}).then(res => {
          console.log(res);
          if (res.data.code == "200") {
            console.log('-->'+JSON.stringify(res.data.message));
            resolve(res.data.message)
          }
        });
      },*/
     loadNode(node,resolve){
        console.log(node);
        if(node.level==0){
          return false;
        }
        api.dataDetCatalog({params : {prid:node.data.id}}).then(res => {
          if (res.data.code == "200") {
            resolve(res.data.message);
          }
        });
      }
    },

    mounted() {
      $("#execution").layout();
      this.height = ($("#taskList").height()).toString();
      this.getCatalog();
    },
    filters: {
      status(statu) {
        console.log(statu)
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
    }
  }
  ;
</script>


