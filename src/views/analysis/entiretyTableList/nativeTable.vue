<template>
    <div id="nativeTable">
        <!-- 搜索框 -->
        <div class="search-item">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="年度">
                    <el-select v-model="form.nd" placeholder="请选择年度" style="width:150px;" size="small" @change="changeNd">
                        <el-option v-for="(item,index) in nds" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行政区划">
                    <el-input v-model="form.xzdm" placeholder="请输入内容" size="small" style="width:150px;"></el-input>
                </el-form-item>
                <el-form-item label="一级分类">
                    <el-select v-model="form.sjyjfl" placeholder="请选择一级分类" size="small" style="width:150px;" @change="changeSjyj">
                        <el-option v-for="(item,index) in sjyjfl" :key="index" :label="item.zdmc" :value="item.zddm"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select v-model="form.sjejfl" placeholder="请选择二级分类" size="small" style="width:150px;" @change="changeSjej">
                        <el-option v-for="(item,index) in sjejfl" :key="index" :label="item.zdmc" :value="item.zddm"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类">
                    <el-select v-model="form.sjsjfl" placeholder="请选择三级分类" size="small" style="width:150px;" @change="changeSjsj">
                        <el-option v-for="(item,index) in sjsjfl" :key="index" :label="item.zdmc" :value="item.zddm"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="四级分类">
                    <el-select v-model="form.sjfjfl" placeholder="请选择四级分类" size="small" style="width:150px;">
                        <el-option v-for="(item,index) in sjfjfl" :key="index" :label="item.zdmc" :value="item.zddm"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据批次">
                    <el-select v-model="form.sjpc" placeholder="请选择数据批次"  style="width:150px;">
                        <el-option v-for="(item,index) in sjpcs" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
                    <el-button type="primary" size="small" @click="fetchSetList">设置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div id="layoutBox" class="panel-content">
            <!-- 表格 -->
            <div data-options="region:'west',split:true" title="列表" style="width:250px;">
                <el-tree highlight-current :data="treeData" :props="defaultProps" id="tableTree" @node-click="treeNodeClick" v-loading.body="loadTree"></el-tree>
            </div>
            <div data-options="region:'center',split:true">
                <div class="tool-box" v-if="toolDisplay">
                 <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                 <el-button type="primary" size="small" @click="exportTemplate">模板导出</el-button>
                 <el-upload class="upload-demo" 
                    action="/mainWeb/ProResult/ImportTemplate" 
                    accept=".xlsx" 
                    :on-success="isUpload" 
                    :on-error="uploadFalse" 
                    :data='ProResult' 
                    :headers="requertHeader"
                    :before-upload='beforeUpload'
                    :show-file-list="false" style="display:inline-block;margin-left:10px">
                </el-upload>   
                <el-button size="small" type="primary">模板导入</el-button>
                <!--  <el-button type="primary" size="small" @click="printTable">打印</el-button> -->
                <el-button type="primary" @click.native.stop="removeReportForm" size="small" v-if="bReport">撤销报表</el-button>
                <el-button type="primary" @click.native.stop="submitRelease" size="small" v-else>发布报表</el-button>
                <!-- <el-button type="primary" @click.native.stop="removeTrendChart" size="small" v-if="bTrendChart">撤销趋势</el-button>
                <el-button type="primary" @click.native.stop="trendRelease" size="small" v-else>发布趋势</el-button> -->
                
                <el-select v-model="tableunit" placeholder=" " @change="changeSite" style="width:80px;float:right;margin-right:10px;" size="small">
                    <el-option v-for="item in unitlist" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>

                <el-select v-model="level" multiple placeholder="级别" @change="changeSite" style="width:180px;float:right;margin-right:10px;" size="small">
                    <el-option v-for="item in levelList" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="tableXzdm" placeholder="请选择行政区划" @change="changeSite" style="width:150px;float:right;margin-right:10px;" size="small">
                    <el-option v-for="item in xzdmList" :key="item.XZMC" :label="item.XZMC" :value="item.XZDM"  ></el-option>
                </el-select>
                          
                </div>

                <div class="table-item" v-if="isTable">
                   <el-table :data="tableData.Rows" border   v-loading.body="listLoading" :max-height="260">
                        <el-table-column min-width='130px' v-for="(col,index) in tableData.Cols" :key="index" :prop="col.COLUMN_NAME" :label="col.COMMENTS">
                        </el-table-column>
                    </el-table> 
                </div>
                <div class="table-item" v-else style="position:absolute;top:40px;bottom:40px;left:0px;right:0px;overflow:auto">
                    <div class="table-box">
                        <div v-html='tableHtml'>{{tableHtml}}</div>
                    </div>
                </div>
                <div class="page">
                    <el-pagination @size-change="sizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 设置弹窗 -->
        <el-dialog title="设置" :visible.sync="dialogFormVisible">
            <div class="setup-list" style="width: 380px;margin: 0 auto">
                <ul style="margin:0px;">
                    <li style="float:left;width:80px;border-right:1px solid #dbe3e7;height:32px;line-height:32px;text-align:center">加入目录</li>
                    <li style="border:1px solid #dbe3e7;height:32px;line-height:32px;text-align:center;width:300px">节点分类</li>
                </ul>
                <draggable v-model="setList" :options="sortOptions" @start="drag=true" @end="drag=false">
                    <ul v-for="(element,index) in setList" :key='index' style="margin:0px;clear:both">
                        <li style="float:left;width:80px;border-right:1px solid #dbe3e7;height:32px;line-height:32px;text-align:center">
                            <el-checkbox v-model="element.isChecked" ></el-checkbox>
                        </li>
                        <li style="border:1px solid #dbe3e7;border-top:none;height:32px;line-height:32px;text-align:center;width:300px">{{element.code}}</li>
                    </ul>
                </draggable>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="saveSetList">确 定</el-button>
            </div>
        </el-dialog>

 
    </div>
</template>

<script>
import api from "../../../fetch/index";
import { mapActions } from "vuex";
import draggable from "vuedraggable";
//import { dragZone, dragHandle } from 'vue-drag-zone'
import Sortable from "sortablejs";
let id = 1000;
export default {
  name: "nativetable",
  components: {
    draggable
    //     dragZone,
    //   dragHandle
  },
  data() {
    return {
      ProResult: {
        srid: "",
        sType: ""
      },
      requertHeader: {
        Authorization: ""
      },
      checked: true, //设置列表选中
      loadTree: false, //加载左侧树转圈
      listLoading: false,
      dialogFormVisible: false, // 设置弹窗
      dialogFormVisible2: false,
      tableHeight: "",
      isTable: true,
      //搜索框数据
      form: {
        nd: "", //年度
        xzdm: "", //行政区划
        sjyjfl: "", //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "", //数据三级分类
        sjfjfl: "", //数据四级分类
        sjpc: "" //数据批次
      },
      //年份列表数据
      nds: [],
      //数据一级分类
      sjyjfl: [],
      //数据批次列表数据
      sjpcs: [],
      sjejfl: [],
      sjsjfl: [],
      sjfjfl: [],
      //左侧树数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //设置列表数据
      setList: [],
      sortOptions: {
        group: "sample",
        animation: 150
      },
      treeNodeId: "",
      tableData: [], //内容右侧表
      tags: [{ name: "标签一", type: "" }, { name: "标签二", type: "gray" }],
      //    tableName: '',
      loadTree2: false,
      ContentsData: [],
      pShowCataID: "", //发布表弹窗选中节点
      pageIndex: 1,
      pageSize: 20,
      toolDisplay:false,
       tableXzdm:'',
       xzdmList:[],
        levelList:[],
        tableunit : '公顷',
        unitlist : [{
          value : '公顷',
          label : '公顷'
        },
           {
            value : '亩',
            label : '亩'
          }, {
            value : '万亩',
            label : '万亩'
          }],
      pageSizes: [20, 50, 100, 200, 500],
      Total: 0,
      tableRid: "",
       bReport:'', //是否已发布报表
       bTrendChart:'',//是否已发布趋势
        tableYaer:'',//表年份
        level: ['省','市','县'],
        serviceUrl:'http://10.0.0.7:8080'
    };
  },
  methods: {
    //左侧树节点点击
    treeNodeClick(eve, node) {
      if (node.isLeaf) {
        this.tableYaer = eve.attributes.year;
        this.toolDisplay = true;
        this.TreeRidNum = "";
        this.tableName = eve.label;
        this.listLoading = true;
        this.showTableRid = eve.attributes.id;
        this.tableXzdm = "";
        //获取行政区划
        let data = {
          srid: this.showTableRid,
          sType: "sourceTable"
        };
        console.log(data);
        api.fetchGetXZDMs({ params: data }).then(res => {
          console.log(res.data);
          if (res.data.code == 102) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "warning"
            });
          } else if (res.data.code == 99) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "warning"
            });
          } else {
            this.tableXzdm = res.data[0].XZDM;
            this.xzdmList = res.data;
          }

          //获取行政级别
          api.fetchGetXZQRange({ params: { nf: this.tableYaer } }).then(res => {
            this.levelList = res.data;
            let showtable = {
              srid: this.showTableRid,
              sType: "sourceTable",
              mjdw: this.tableunit,
              xzdm: this.tableXzdm,
              xzjbs: this.level.toString(),
              page: this.pageIndex,
              pageCount: this.pageSize
            };
            console.log(showtable);
            api.fetchSearchShowTableByXZDM({ params: showtable }).then(res => {
              //   console.log('eves:'+JSON.stringify(res.data))
              this.bReport = res.data.bReport;
              this.bTrendChart = res.data.bTrendChart;
              if (res.data.html != "") {
                this.isTable = false;
                this.tableHtml = res.data.html;
              } else {
                this.isTable = true;
                this.tableData = res.data;
              }
              this.listLoading = false;
              this.Total = res.data.Count;
            });
          });
        });
      }
    },
    //表格设置切换
      changeSite : function(){
        console.log(this.level.toString())

        this.listLoading = true
        let showtable = {
          srid : this.showTableRid,
          sType : 'sourceTable',
          xzdm : this.tableXzdm,
          xzjbs:this.level.toString(),
          mjdw : this.tableunit,
          page : this.pageIndex,
          pageCount : this.pageSize 
 
        }
        console.log(showtable)
         api.fetchSearchShowTableByXZDM({params : showtable})
          .then(res =>{
              this.bReport = res.data.bReport
              this.bTrendChart = res.data.bTrendChart
              if(res.data.html != ''){
                this.isTable = false;
                this.tableHtml = res.data.html
              } else {
                this.isTable = true;
                console.log('res.data'+JSON.stringify(res.data))
                this.tableData = res.data;
              }
              this.listLoading = false
              this.Total = res.data.Count
          }) 
      },
    // 搜索框搜索按钮点击
    onSubmit() {
      this.loadTree = true;
      //搜索原生表，返回左侧目录树
      api.fetchSearchSourceTable({ params: this.form }).then(res => {
        this.treeData = res.data;
        this.loadTree = false;
      });
    },
    //发送设置数据
    saveSetList() {
      this.dialogFormVisible = false;
      for (var i = 0; i < this.setList.length; i++) {
        if (this.setList[i].code == "年度") {
          this.setList[i].code = "nd";
        }
        if (this.setList[i].code == "行政区划") {
          this.setList[i].code = "xzdm";
        }
        if (this.setList[i].code == "一级分类") {
          this.setList[i].code = "sjyjfl";
        }
        if (this.setList[i].code == "二级分类") {
          this.setList[i].code = "sjejfl";
        }
        if (this.setList[i].code == "三级分类") {
          this.setList[i].code = "sjsjfl";
        }
        if (this.setList[i].code == "四级分类") {
          this.setList[i].code = "sjfjfl";
        }
        if (this.setList[i].code == "数据批次") {
          this.setList[i].code = "sjpc";
        }
        if (this.setList[i].isChecked == false) {
          this.setList[i].isChecked = 0;
        }
        if (this.setList[i].isChecked == true) {
          this.setList[i].isChecked = 1;
        }
      }
      var result = JSON.stringify(this.setList);
      api
        .fetchSearchParaSave({ searchParas: result })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.loadTree = true;
            api
              .fetchSearchSourceTable({ params: this.form })
              .then(res => {
                this.treeData = res.data;
                this.loadTree = false;
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //下拉改变刷新搜索框
    changeNd() {
      //获取数据数据一级分类列表
      let sjyjfldata = {
        sjdjfl: "sjyjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: "", //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjyjfldata }).then(res => {
        this.sjyjfl = res.data;
      });
      //获取数据数据二级分类列表
      let sjejfldata = {
        sjdjfl: "sjejfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: "", //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjejfldata }).then(res => {
        this.sjejfl = res.data;
      });

      //获取数据数据三级分类列表
      let sjsjfldata = {
        sjdjfl: "sjsjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: "", //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjsjfldata }).then(res => {
        this.sjsjfl = res.data;
      });

      //获取数据数据四级分类列表
      let sjfjfldata = {
        sjdjfl: "sjfjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: "", //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjfjfldata }).then(res => {
        this.sjfjfl = res.data;
      });
    },
    changeSjyj() {
      //获取数据数据二级分类列表
      let sjejfldata = {
        sjdjfl: "sjejfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjejfldata }).then(res => {
        this.sjejfl = res.data;
      });

      //获取数据数据三级分类列表
      let sjsjfldata = {
        sjdjfl: "sjsjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjsjfldata }).then(res => {
        this.sjsjfl = res.data;
      });

      //获取数据数据四级分类列表
      let sjfjfldata = {
        sjdjfl: "sjfjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: "", //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjfjfldata }).then(res => {
        this.sjfjfl = res.data;
      });
    },
    changeSjej() {
      //获取数据数据三级分类列表
      let sjsjfldata = {
        sjdjfl: "sjsjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: this.form.sjejfl, //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjsjfldata }).then(res => {
        this.sjsjfl = res.data;
      });

      //获取数据数据四级分类列表
      let sjfjfldata = {
        sjdjfl: "sjfjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: this.form.sjejfl, //数据二级分类
        sjsjfl: "" //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjfjfldata }).then(res => {
        this.sjfjfl = res.data;
      });
    },
    changeSjsj() {
      //获取数据数据四级分类列表
      let sjfjfldata = {
        sjdjfl: "sjfjfl",
        nd: this.form.nd, //年度
        xzdm: "", //行政区划
        sjyjfl: this.form.sjyjfl, //数据一级分类
        sjejfl: this.form.sjejfl, //数据二级分类
        sjsjfl: this.form.sjsjfl //数据三级分类
      };
      api.fetchSearchParaGetSjdjfl({ params: sjfjfldata }).then(res => {
        this.sjfjfl = res.data;
      });
    },
    //获取设置列表
    fetchSetList() {
      this.dialogFormVisible = true;
      //获取设置列表
      let datas = {
        searchType: "sourceTable"
      };
      api.fetchSearchPara({ params: datas }).then(res => {
        this.setList = res.data;
        for (var i = 0; i < this.setList.length; i++) {
          if (this.setList[i].code == "nd") {
            this.setList[i].code = "年度";
          }
          if (this.setList[i].code == "xzdm") {
            this.setList[i].code = "行政区划";
          }
          if (this.setList[i].code == "sjyjfl") {
            this.setList[i].code = "一级分类";
          }
          if (this.setList[i].code == "sjejfl") {
            this.setList[i].code = "二级分类";
          }
          if (this.setList[i].code == "sjsjfl") {
            this.setList[i].code = "三级分类";
          }
          if (this.setList[i].code == "sjfjfl") {
            this.setList[i].code = "四级分类";
          }
          if (this.setList[i].code == "sjpc") {
            this.setList[i].code = "数据批次";
          }
          if (this.setList[i].isChecked == 0) {
            this.setList[i].isChecked = false;
          }
          if (this.setList[i].isChecked == 1) {
            this.setList[i].isChecked = true;
          }
        }
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.setList = [];
    },
    //导出
    exportExcel: function() {
      if (this.tableRid == "") {
        this.$message({
          showClose: true,
          message: "请选择需要导出的表！",
          type: "warning"
        });
      } else {
        let exportTable = {
          srid: this.tableRid,
          sType: "sourceTable"
        };
        api.fetchGetExportExcel({ params: exportTable }).then(res => {
          if (res.data.message) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
          } else {
            window.location.href =
              "http://10.0.0.7:8080/mainWeb" + res.data + "";
          }
        });
      }
    },
    //导出模板
    exportTemplate() {
      if (this.tableRid == "") {
        this.$message({
          showClose: true,
          message: "请选择需要导出的表！",
          type: "warning"
        });
      } else {
        let ImportTemplate = {
          srid: this.tableRid,
          sType: "sourceTable"
        };
        api.fetchGetExportTemplate({ params: ImportTemplate }).then(res => {
          console.log(res);
          window.location.href = "http://10.0.0.7:8080/mainWeb" + res.data + "";
        });
      }
    },
    beforeUpload(file) {
      this.ProResult.srid = this.showTableRid;
      this.ProResult.sType = "sourceTable";
    },
    //导入模板成功后
    isUpload() {
      this.$message({
        showClose: true,
        message: "导入成功",
        type: "success"
      });
      let showtable = {
        srid: this.tableRid,
        sType: "sourceTable",
        page: this.pageIndex,
        pageCount: this.pageSize
      };
      api.fetchSearchShowTable({ params: showtable }).then(res => {
        console.log(res.data);
        this.Total = res.data.Count;
        this.listLoading = false;
        if (res.data.html != "") {
          this.isTable = false;
          this.tableHtml = res.data.html;
        } else {
          this.isTable = true;
          this.tableData = res.data;
        }
      });
    },
    //导入模板失败
    uploadFalse() {
      this.$message({
        showClose: true,
        message: "导入失败",
        type: "error"
      });
    },
    //分页
    sizeChange: function(pageSize) {
      this.pageSize = pageSize;
      let showtable = {
        srid: this.tableRid,
        sType: "sourceTable",
        page: this.pageIndex,
        pageCount: this.pageSize
      };
      api.fetchSearchShowTable({ params: showtable }).then(res => {
        if (res.data.html != "") {
          this.isTable = false;
          this.tableHtml = res.data.html;
        } else {
          this.isTable = true;
          this.tableData = res.data;
        }
      });
    },
    pageIndexChange: function(pageIndex) {
      this.pageIndex = pageIndex;
      let showtable = {
        srid: this.tableRid,
        sType: "sourceTable",
        page: this.pageIndex,
        pageCount: this.pageSize
      };
      api.fetchSearchShowTable({ params: showtable }).then(res => {
        if (res.data.html != "") {
          this.isTable = false;
          this.tableHtml = res.data.html;
        } else {
          this.isTable = true;
          this.tableData = res.data;
        }
      });
    }
  },
  mounted() {
    this.requertHeader.Authorization = window.localStorage.getItem("token");
    this.$nextTick(() => {
      $("#layoutBox").layout();
     //this.tableHeight = $("#layoutBox").height() - 80;
    });
    //获取原生表年份
    this.loadTree = true;
    api.fetchSearchParaGetNds().then(res => {
      this.nds = res.data;
      this.form.nd = this.nds[0];
      //第一次渲染左侧树数据
      api.fetchSearchSourceTable({ params: this.form }).then(res => {
        this.treeData = res.data;
        this.loadTree = false;
      });
    });

    //获取数据批次列表
    api.fetchSearchParaGetSjpc().then(res => {
      this.sjpcs = res.data;
    });

    //获取数据数据一级分类列表
    let sjyjfldata = {
      sjdjfl: "sjyjfl",
      nd: "", //年度
      xzdm: "", //行政区划
      sjyjfl: "", //数据一级分类
      sjejfl: "", //数据二级分类
      sjsjfl: "" //数据三级分类
    };
    api.fetchSearchParaGetSjdjfl({ params: sjyjfldata }).then(res => {
      this.sjyjfl = res.data;
    });

    //获取数据数据二级分类列表
    let sjejfldata = {
      sjdjfl: "sjejfl",
      nd: "", //年度
      xzdm: "", //行政区划
      sjyjfl: "", //数据一级分类
      sjejfl: "", //数据二级分类
      sjsjfl: "" //数据三级分类
    };
    api.fetchSearchParaGetSjdjfl({ params: sjejfldata }).then(res => {
      this.sjejfl = res.data;
    });

    //获取数据数据三级分类列表
    let sjsjfldata = {
      sjdjfl: "sjsjfl",
      nd: "", //年度
      xzdm: "", //行政区划
      sjyjfl: "", //数据一级分类
      sjejfl: "", //数据二级分类
      sjsjfl: "" //数据三级分类
    };
    api.fetchSearchParaGetSjdjfl({ params: sjsjfldata }).then(res => {
      this.sjsjfl = res.data;
    });

    //获取数据数据四级分类列表
    let sjfjfldata = {
      sjdjfl: "sjfjfl",
      nd: "", //年度
      xzdm: "", //行政区划
      sjyjfl: "", //数据一级分类
      sjejfl: "", //数据二级分类
      sjsjfl: "" //数据三级分类
      // sjfjfl: '', //数据四级分类
    };
    api.fetchSearchParaGetSjdjfl({ params: sjfjfldata }).then(res => {
      this.sjfjfl = res.data;
    });
  }
};
</script>
 
 
