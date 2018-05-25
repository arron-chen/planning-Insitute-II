<template>
	<div class="taskListThree" style="margin-top: 60px">
		<el-table :data="subTasksDetail" border :max-height="height-40">

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
        <div class="error-table">
        <el-dialog width="60%" :visible.sync="innerVisible" append-to-body title="日志详情">
            <div v-html="detiallogs"></div>
        </el-dialog>
        <el-dialog width="60%" :visible.sync="innerVisible2" append-to-body title="实际参数">
                <div>
           <!--  <el-form ref="form" :model="valueslistform"  >
             <el-form-item :label="key" v-for="(value,key) in valueslist" style="margin-bottom: 0px;border:1px solid;border-top:none;">
                    <span> {{value}}</span>
                 </el-form-item>
             </el-form>  -->
             <table class="valueslist-table">
            <tr v-for="(value,key) in valueslist">
              <td>{{key}}</td>
              <td>{{value}}</td>
            </tr>
                      </table>
          </div>
       <!--   <el-table :data="valueslist" style="width: 100%">
            <el-table-column  prop="value" :label="key"   v-for="(value,key) in valueslist">

            </el-table-column>

        </el-table>  -->
       </el-dialog>
        <!-- <div>错误信息</div>
        <el-table :data="subTasksDetailLogs" border>

        </el-table> -->
        </div>
	</div>
</template>
<script>
 import dateFormat from "@/tools/date/format.js";
 import api from "../../../fetch/index";
	export default{
		data(){
			return{
			  height:"",
				subTasksDetail:[],
				subTasksDetailLogs:[],
				taskid:'',
				subtaskList:{
          			currentPage:1,
          			pageRows:2,
          			total:null
        		},
        innerVisible: false,
         detiallogs: '',
        innerVisible2: false,
        valueslistform: {},
        valueslist: '',
			}

		},
		mounted() {
    	 	this.taskid = this.$route.query.data;
        this.height = ($(".taskListThree").height()).toString();
    	 	this.getData();
    	 },
		watch:{
    	 '$route': function (newQuestion, oldQuestion) {
    	 	this.taskid = this.$route.query.data;
    	 	this.getData();
    	 }

        },
		methods:{
			getData(){

				this.subtaskList.total = 0;
        		this.subtaskList.currentPage = 1;
        		this.subtaskList.pageRows = 10;
        	let data = {taskID: this.taskid,page:this.subtaskList.currentPage,rows:this.subtaskList.pageRows};
        	api.getTaskJobXZQs({params: data}).then(res => {
        		console.log(res.data.message)
          			this.subTasksDetail = res.data.message;
          			this.subtaskList.total = res.data.total;
        		})


			},
			formatter(row, column) {
        	var date = row[column.property];
        	return dateFormat(date, "YYYY-MM-DD HH:mm:ss");
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
            console.log(res.data.message)
            this.valueslist = res.data.message
          })
      },
      subtaskListSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.subtaskList.pageRows = val;
        this.showSubTaskListAttribute();
      },
      subtaskListCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.subtaskList.currentPage = val;
        this.showSubTaskListAttribute();
      },
      showSubTaskListAttribute(){
        let data = {taskID: this.taskid,page:this.subtaskList.currentPage,rows:this.subtaskList.pageRows};
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

		}
	}

</script>
<style lang="less" scoped>

  .valueslist-table {
    width: 100%;
    td {
      border: 1px solid #ebeef5;
      padding: 5px;
      color: #606266;
      word-break: break-all;
      max-width: 50%;
    }
  }

</style>
<style lang="less" scoped>
  .pagination-table{
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top: 3px;
  }
  .taskListThree{
    position:absolute;top:0px;bottom:0px;left:0px;right:0px;
  }
</style>
