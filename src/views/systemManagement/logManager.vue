<template>
    <div class="log-manager" id="logManager">
        <div class="search-content" >
            <div class="search-content_item">
                <el-input v-model="input" placeholder="操作人员" style="width:200px;"></el-input>
                <el-select v-model="value" placeholder="操作行为">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-date-picker v-model="startTime" type="date" placeholder="开始时间"></el-date-picker>
                -
                <el-date-picker v-model="endTime" type="date" placeholder="结束时间"></el-date-picker>
                <el-button type="primary" icon="search" @click="fetchData">查询</el-button>
            </div>
        </div>
        <div class="log-table">
            <el-table border :data="tableData" style="width: 100%" :max-height="tableHeight">
                <el-table-column prop="id" label="id" width="120"></el-table-column>
                <el-table-column prop="modelName" label="操作模块" width="140"></el-table-column>
                <el-table-column prop="optionContent" label="操作内容" width="140"></el-table-column>
                <el-table-column prop="optname" label="操作人" width="140"></el-table-column>
                <el-table-column prop="optip" label="操作IP" width="140"></el-table-column>
                <el-table-column prop="opttime" label="操作时间"></el-table-column>
             <el-table-column prop="optruntime" label="用时" width="140"></el-table-column>
             <el-table-column prop="optresult" label="状态"></el-table-column>  
            </el-table>
        </div>
        <div class="page">
            <el-pagination @size-change="sizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"></el-pagination>
        </div>
    </div>
</template>
<script>
import api from '../../fetch/index'
export default {
    data() {
        return {
            tableHeight:'200',
            input: '',
            options: [{
                value: '选项1',
                label: '全部'
            }],
            value: '',
            startTime: '',
            endTime: '',
            pageIndex: 1,
            pageSize: 20,
            pageSizes: [20, 50, 100, 200],
            Total:0,
            tableData:[]
        }
    },
    mounted() {
        this.fetchData()
        this.$nextTick(() =>{
        console.log(this.tableHeight)
        this.tableHeight = ($('#logManager').height() - 120).toString(); 
        console.log(this.tableHeight)
        $('#logManager').layout()
      })
    },
    methods: {
        fetchData: function() {
            api.fetchFindAllByPage({
                params: {
                    page: this.pageIndex,
                    rows: this.pageSize,
                    optname: this.input,
                    starttime: this.startTime,
                    endtime: this.endTime
                }
            })
                .then((res) => {
                    this.tableData=res.data.rows
                    console.log('this.tableData:'+JSON.stringify(this.tableData))
                    this.Total=res.data.total
                })
        },
        sizeChange: function(pageSize) {
            this.pageSize = pageSize;
            this.fetchData();
        },
        pageIndexChange: function(pageIndex) {
            console.log(pageIndex);
            this.pageIndex = pageIndex;
            this.fetchData();
        }
    }
}
</script>
<style scoped>
.log-manager {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 12px;
    bottom:20px;
    
}

.search-content {
    width: 100%;
    border: 1px solid #dbe3e7;
    background: #fff;
    font-size: 16px;
    border-radius: 3px;
}

.search-content_item {
    margin: 16px;
}

.log-table {
    margin-top: 20px;
    overflow: auto;
}

.positive-row {
    background: #e2f0e4;
}
</style>