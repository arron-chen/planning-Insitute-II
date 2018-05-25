<template>
	<div class="content" style="background:#fff">
		<div class="table-box" >
		 	<div class="tool-box">
                        <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                        <el-button type="primary" size="small" @click="printExcel">打印</el-button>
                        <el-select v-model="tableunit" placeholder=" " @change="changeSite "  style="width:95px;float:right;margin-right:10px;" size="small" >
                        <el-option v-for="item in unitlist" :key="item.value" :label="item.label" :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                        </el-select>
          <el-select v-model="level" multiple placeholder="级别" @change="changeSite" style="width:180px;float:right;margin-right:10px;" size="small">
                      <el-option v-for="item in levelList" :key="item" :label="item":value="item">
                      </el-option>
                    </el-select>
          <el-select v-model="tableXzdm" placeholder="请选择行政区划" @change="changeSite" style="width:150px;float:right;margin-right:10px;" size="small">
            <el-option v-for="item in xzdmList" :key="item.XZMC" :label="item.XZMC" :value="item.XZDM"  ></el-option>
          </el-select>
      </div>
      <div id="tablePrint">
			    <el-table :data="tableData.Rows"  v-loading.body="listLoading" v-if="isTable" :max-height="tableHeight">
                    <el-table-column min-width='130px' v-for="(col,index) in tableData.Cols" :key="index" :prop="col.COLUMN_NAME" :label="col.COMMENTS"> </el-table-column>  
			    </el-table>
                <div class="table-box" v-else="isTable" style="position:absolute;top:50px;bottom:40px;left:0px;right:0px;overflow:auto">
                    <div v-html='tableHtml'>
                        {{tableHtml}}
                    </div>
                </div>
      </div>
            <div class="page" style="position:absolute;bottom:6px">
                <el-pagination @size-change="sizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"></el-pagination>
            </div>
		</div>
	</div>
</template>
<script>
import api from '../../fetch/index'
import {mapMutations, mapActions, mapGetters} from 'vuex'
export default {
	data() {
		return{
			sourceTable:'',
			reportFormId:'',
			tableData: [],
			isTable: false,
          	isIframe: false,
          	listLoading:false,
			smartbiSrc: '',
			tableHeight:' ',
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
                value: '亩',
                label: '亩'
            },{
                value: '万亩',
                label: '万亩'
            }],
            isTable:true,
            tableXzdm:'',
            xzdmList:[],
            level: ['省','市','县'],
            levelList:[],
            tableHtml:'',
            tableYaer:'',
            serviceUrl:''
		}
	},
	mounted(){
	 	this.reportFormId = this.$store.state.reportform.reportFormId;
	 	this.sourceTable = this.$store.state.reportform.sourceTable;
    let H=(document.getElementById('reportFormContent').offsetHeight-180).toString();
                     console.log(H)
                     this.tableHeight= H
                  //获取行政区划 
          let data = {
            srid : this.reportFormId,
            sType : this.sourceTable,
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
                        message : '无行政区相关数据',
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
                  srid : this.reportFormId,
                  sType : this.sourceTable,
                  mjdw : this.tableunit,
                  xzdm : this.tableXzdm,
                  xzjbs:this.level.toString(),
                  page : this.pageIndex,
                  pageCount : this.pageSize
                }
            api.fetchSearchShowTableByXZDM({params : showtable})
            .then(res =>{
              console.log(res.data)
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
	},
	methods:{
        //导出
        exportExcel:function(){
            if(this.showTableRid == ''){
                 this.$message({
                    showClose: true,
                    message: '请选择需要导出的表！', 
                    type: 'warning'
                });
            } else {
                let exportTable = {
                    srid: this.$store.state.reportform.reportFormId,
                    sType:this.sourceTable,
                    mjdw : this.tableunit,
                    xzdm : this.tableXzdm,
                    xzjbs:this.level.toString(),
                }
                api.fetchGetExportExcel({ params: exportTable })
                    .then(res => {
                    window.location.href = this.serviceUrl+"/mainWeb" + res.data + "" 
                })
            }
             
        },
        //打印
        printExcel:function(){
          let newWindow = window.open("_blank");   //打开新窗口
          let codestr = document.getElementById("tablePrint").innerHTML;   //获取需要生成pdf页面的div代码
          newWindow.document.write(codestr);   //向文档写入HTML表达式或者JavaScript代码
          newWindow.document.close();     //关闭document的输出流, 显示选定的数据
          newWindow.print();   //打印当前窗口
          return true;  
        },
        //表格设置切换
      changeSite : function(){
        this.listLoading = true
        let showtable = {
          srid:this.reportFormId,
          sType:this.sourceTable,
          xzdm : this.tableXzdm,
          xzjbs:this.level.toString(),
          mjdw : this.tableunit,
          page : this.pageIndex,
          pageCount : this.pageSize 
 
        }
         api.fetchSearchShowTableByXZDM({params : showtable})
          .then(res =>{
             if(res.data.html !=''){
                            this.isTable = false;
                            this.tableHtml = res.data.html
                        } else{
                             this.tableData = res.data;
                        }        
                        this.listLoading = false
                        this.Total = res.data.Count
                     let H=document.getElementById('reportFormContent').offsetHeight-180
                     console.log(H)
                 //    this.tableHeight= H
          }) 
      },
		//分页
        sizeChange: function(pageSize) {
            this.pageSize = pageSize;
           let showtable = {
                    srid:this.reportFormId,
                    sType:this.sourceTable,
                    xzdm : this.tableXzdm,
                    xzjbs:this.level.toString(),
                    mjdw : this.tableunit,
                    page:this.pageIndex,
                    pageCount:this.pageSize 
                } 
            api.fetchSearchShowTableByXZDM({ params: showtable })
                .then(res => {
                     if(res.data.html !=''){
                            this.isTable = false;
                            this.tableHtml = res.data.html
                        } else{
                             this.tableData = res.data;
                        }        
                        this.listLoading = false
                        this.Total = res.data.Count
                     let H=document.getElementById('reportFormContent').offsetHeight-180
                  //   this.tableHeight=H
            })
        },
        pageIndexChange: function(pageIndex) {
        	this.pageIndex = pageIndex
          let showtable = {
                    srid:this.reportFormId,
                    sType:this.sourceTable,
                    xzdm : this.tableXzdm,
                    xzjbs:this.level.toString(),
                    mjdw : this.tableunit,
                    page:this.pageIndex,
                    pageCount:this.pageSize 
                } 
            api.fetchSearchShowTableByXZDM({ params: showtable })
                .then(res => {
                     if(res.data.html !=''){
                            this.isTable = false;
                            this.tableHtml = res.data.html
                        } else{
                             this.tableData = res.data;
                        }        
                        this.listLoading = false
                        this.Total = res.data.Count
                     let H=document.getElementById('reportFormContent').offsetHeight-180
               //      this.tableHeight=H
            })
        }
	}
}
</script>
<style>
 
</style>