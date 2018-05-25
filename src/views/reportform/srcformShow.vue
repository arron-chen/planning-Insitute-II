<template>
	<div id="srcformShow" class="panel-content">
		<!-- <drag-zone class="zoon"> -->
			<div class="zoon-panel tool" v-loading.body="loadTree" style="min-width:180px">
			   <el-tree :data="treeData" :props="defaultProps" @node-click=" "></el-tree>
			</div>
			<!-- <drag-handle class="handle"></drag-handle> -->
			<div class="zoon-panel program">
				<el-table :data="tableData"style="width: 100%">
      				<el-table-column prop="date" label="日期" width="180"> </el-table-column>
     				<el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      				<el-table-column prop="address" label="地址"> </el-table-column>
   				</el-table>
			</div>
		<!-- </drag-zone> -->
	</div>
</template>
<script>
import api from '../../fetch/index'
// import { dragZone, dragHandle } from 'vue-drag-zone'
export default {
	data() {
      return {
      	loadTree:false,
      	defaultProps: {
          children: 'children',
          label: 'label'
		},
      	treeData:[],
      	tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
      }
    },
    components: {
		// dragZone,
		// dragHandle
	},
	mounted(){
		this.loadTree=true
		api.fetchGetReportCatas()
		.then(res=>{
			this.loadTree=false
			this.treeData = res.data; 
		})
	}


}

</script>

<style scoped>
	 
</style>


