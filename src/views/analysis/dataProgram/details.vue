<template>
	<div class="taskListTwo" style="margin-top: 60px">
		<el-table :data="subTasks" border :max-height="height-40">
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
      </el-table>
    <el-pagination
      class="pagination-table"
      @size-change="taskListSizeChange"
      @current-change="taskListCurrentChange"
      :current-page="taskList.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="taskList.total">
    </el-pagination>
	</div>
</template>
<script>
 import dateFormat from "@/tools/date/format.js";
import api from "../../../fetch/index";
	export default{
		data(){
			return{
			   height:"",
				 subTasks: [],
				 prid:'',
				 taskList:{
          			currentPage:1,
          			pageRows:2,
          			total:null
        		},
			}
		},
		mounted() {
    	 	this.prid = this.$route.query.data;
        this.height = ($(".taskListTwo").height()).toString();
    	 	this.getData();
    	 },
		watch:{
    	 '$route': function (newQuestion, oldQuestion) {
    	 	this.prid = this.$route.query.data;
    	 	this.getData();
    	 }

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
    methods:{
    	getData(){
    		this.taskList.total = 0;
        	this.taskList.currentPage = 1;
        	this.taskList.pageRows = 10;

        let params = {prid: this.prid,page:this.taskList.currentPage,rows:this.taskList.pageRows};
        api.getSubTasks({params: params}).then(res => {
          if (res.data.code == 200) {
            if (res.data.message.length == 0) {
              this.taskList.total = 0;
            }
            this.subTasks = res.data.message;
            this.taskList.total = res.data.total;
          }
        });
    	},
    	formatter(row, column) {
        	var date = row[column.property];
        	return dateFormat(date, "YYYY-MM-DD HH:mm:ss");
     	},
    	childDetails(a, b){
    		this.$router.push({'path':'/dataprogram/childdetails',query: { 'data':b.rid    }})
        		this.$store.state.dataProgram.breadcrumbList.push({"label":b.name,'url':'/dataprogram/childdetails','data':b.rid})
    	},
      showTaskListAttribute(){
        let params = {prid: this.prid,page:this.taskList.currentPage,rows:this.taskList.pageRows};
        api.getSubTasks({params: params}).then(res => {
          if (res.data.code == 200) {
            this.subTasks = res.data.message;
            this.taskList.total = res.data.total;
          }
        });
      },
      taskListSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.taskList.pageRows = val;
        this.showTaskListAttribute();
      },
      taskListCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.taskList.currentPage = val;
        this.showTaskListAttribute();
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
  .taskListTwo{
       position:absolute;top:0px;bottom:0px;left:0px;right:0px;
     }
</style>
