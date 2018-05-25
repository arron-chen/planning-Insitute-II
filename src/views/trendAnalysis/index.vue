<template>
  <div id="trendAnalysis" class="panel-content">
    <div data-options="region:'west',split:true,collapsible:true,tools:'#tools'" title="趋势列表" style="width:285px;">
      <div class="layout-box tool">
        <el-tree :data="trendTree" v-loading.body="loadTrendTree" :props="defaultProps" :load="loadNode" lazy @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div id="tools">
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>

    <div data-options="region:'center',split:true,collapsible:true" title="趋势">
      <div style="margin: 8px;border: 1px solid #d4d4d4;border-radius:3px;overflow:hidden;padding:10px 30px;background:#fff">
              <el-button type="primary" size="small"  @click="changeType" style="float:right;margin-left:10px" v-if="btnDisplay">{{displayType}}</el-button>
              <div style="display:inline-block;float:right;margin-left:10px">
                预测到<el-select v-model="yearData" placeholder="" size="small" style="width:120px;margin:0px 4px;"  @change="changeSite">
                         <el-option v-for="(item,index) in yearList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>年
              </div>
              <el-select v-model="dataXzqh" placeholder="请选择行政区划" size="small" style="width:140px;margin:0px 4px;float:right"  @change="changeSite">
                   <el-option v-for="(item,index) in xzqhList" :key="item.XZDM" :label="item.XZMC" :value="item.XZDM"></el-option>
              </el-select>
      </div>
      <div v-if='showChart' style="margin:10px">
        <el-collapse v-model="activeNames" style="border:none">
          <el-collapse-item :title="item" v-for="(item,key,index) in modelList" :key="item" style="margin-bottom:10px" :name="index">
              <div class="content" style="background:#fff">
                <div v-bind:id=" 'lineChart'+key" style="height:250px;width:850px"></div>
              </div>
               </el-collapse-item>
            </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../fetch/index";
import echarts from "echarts";

require("echarts/theme/macarons"); // echarts 主题
export default {
  data() {
    return {
      activeNames: [0, 1],
      contentwidth: "",
      contentHeight: "",
      loadTrendTree: false,
      showChart: false,
      trendTree: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf:"isLeaf"
      },
      yData: [], //  y轴数据
      xData: [], // x轴数据
      seriesData: [], // bar 数据
      barData: [],
      yName: "",
      xName: "",
      news: [],
      yearData: "",
      yearList: ["2018", "2019", "2020", "2021", "2022"],
      dataXzqh: "",
      xzqhList: [],
      nodeRid: "",
      charType: "line",
      charData: "",
      displayType: "转柱状图",
      namesMap: {},
      btnDisplay: false,
      modelList: {},
      modelListArr: [],
      forceND: ""
    };
  },
  mounted() {
    $("#trendAnalysis").layout();
    this.getTrendTree();
    api.fetchGetTrendModels().then(res => {
      this.modelList = res.data;
    });
  },
  methods: {
    //
    getCatalog() {
      this.getTrendTree();
    },
    //加载树
    getTrendTree() {
      this.loadTrendTree = true;
      let cata = {
        expanseCata: "",
        onlyCata: 0
      };
      api.fetchGetTrendChartCata({ params: cata }).then(res => {
        this.loadTrendTree = false;
        this.trendTree = res.data;
      });
    },
    //分节点加载树
    loadNode(node, resolve) {
      if (node.id == 0) {
        return false;
      }
      var result = JSON.stringify(node.data);
      let ExpanseReport = {
        expanseCata: result,
        onlyCata: 0
      };
      api.fetchGetTrendChartCata({ params: ExpanseReport }).then(res => {
        resolve(res.data.children);
      });
    },
    //左侧菜单点击
    handleNodeClick(data, node) {
      if (node.isLeaf) {
        this.showChart = true;
        this.nodeRid = node.data.rid;
        console.log('srid:'+this.nodeRid )
        api
          .fetchGetXZDMsByTrend({ params: { rid: this.nodeRid } })
          .then(res => {

            console.log('data:'+JSON.stringify(res.data))
            if (res.data.code == 102) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "warning"
              });
            } else if (res.data.code == 99) {
              this.$message({
                showClose: true,
                message: "无行政区相关数据",
                type: "warning"
              });
            } else {
              this.xzqhList = res.data;
              this.dataXzqh = this.xzqhList[0].XZDM;
            }

            if (this.dataXzqh == "") {
            }
            if (this.yearData == "") {
              this.yearData = this.yearList[0];
            }
            this.modelListArr = Object.keys(this.modelList);
            var start = async () => {
              for (var i = 0; i < this.modelListArr.length; i++) {
                await this.getModelData(this.modelListArr[i]);
              }
            };
            start();
          });
      }
    },
    //请求获取模型数据
    getModelData(modelId) {
      let data = {
        rid: this.nodeRid,
        modelRid: modelId,
        xzdm: this.dataXzqh,
        year: this.yearData
      };
      return new Promise((resolve, reject) => {
        api.fetchGetShowTrendChart({ params: data })
        .then(res => {
          resolve();
          this.xName = res.data.XDW;
          this.yName = res.data.YDW;
          this.forceND = res.data.forceND.toString();

          this.charData = res.data;
          for (var i = 0; i < this.charData.Cols.length; i++) {
            var key = this.charData.Cols[i].COLUMN_NAME;
            var val = this.charData.Cols[i].COMMENTS;
            this.namesMap[key] = val;
          }
          var resultData = [];
          //将表格Rows数据key根据Clos数据对应关系替换成中文
          this.changeKeyNames(this.charData.Rows, resultData, this.namesMap);
          this.displayChar(this.charData, resultData, modelId);
          this.btnDisplay = true;
        });
      });
    },
    //将Rows数据映射成中文
    changeKeyNames(data, resultData, namesMap) {
      var _ = require("lodash");
      for (var i = 0; i < data.length; i++) {
        var rightData = _.transform(data[i], function(result, value, key) {
          result[namesMap[key] || key] = value;
        });
        resultData.push(rightData);
      }
    },
    //数据处理展示模型
    displayChar(data, dataRows, modelId) {
      var xField = data.XField;
      this.yData = data.YField;
      //y轴数据处理
      this.yData = this.yData.split(";");
      for (var i = 0; i < this.yData.length; i++) {
        if (this.yData[i] == "" || typeof this.yData[i] == "undefined") {
          this.yData.splice(i, 1);
          i = i - 1;
        }
      }
      var yDataArr = [];
      for (var i = 0; i < this.yData.length; i++) {
        yDataArr.push(this.namesMap[this.yData[i]]);
      }
      this.yData = yDataArr;

      //获取x轴数据
      this.xData = [];
      for (var i = 0; i < data.Rows.length; i++) {
        this.xData.push(data.Rows[i][xField]);
      }

      //根据y轴数据获取柱状数据
      this.seriesData = [];
      for (var k = 0; k < this.yData.length; k++) {
        this.barData = [];
        for (var i = 0; i < dataRows.length; i++) {
          this.barData.push(dataRows[i][this.yData[k]]);
        }
        this.seriesData.push({
          name: this.yData[k],
          type: this.charType,
          data: this.barData,
          markLine: {
            data: [{ xAxis: this.forceND }]
            //  data:[[{name:'ss',coord:[2016,0]},{coord:[2016,133333333]}]]
          }
        }); // bar 数据
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(
        document.getElementById("lineChart" + modelId + "")
      );

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            // dataView : {show : true, readOnly : false},
            // magicType : {show : true, type : ['line', 'bar']},
            // restore : {show : true},
            // saveAsImage : {show : true},
          }
        },
        legend: {
          data: this.yData
        },
        xAxis: [
          {
            name: this.xName,
            type: "category",
            data: this.xData,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [{ name: this.yName }],
        series: this.seriesData
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.onresize = function() {
        //重置容器高宽
        myChart.resize();
      };
    },
    //展示类型切换
    changeType() {
      if (this.charType == "line") {
        this.charType = "bar";
        this.displayType = "转折线图";
      } else if (this.charType == "bar") {
        this.charType = "line";
        this.displayType = "转柱状图";
      }
      var start = async () => {
         for (var i = 0; i < this.modelListArr.length; i++) {
            await this.getData(this.modelListArr[i]);
          }
        };
      start();
    },
    //展示条件筛选
    changeSite() {
       var start = async () => {
         for (var i = 0; i < this.modelListArr.length; i++) {
            await this.getData(this.modelListArr[i]);
          }
        };
      start();
    },
    //筛选后获取数据
    getData(modelId) {
      let data = {
        rid: this.nodeRid,
        modelRid: modelId,
        xzdm: this.dataXzqh,
        year: this.yearData
      };
     return new Promise((resolve, reject) => {
        api.fetchGetShowTrendChart({params : data})
        .then(res =>{
          resolve();
          var resultData = []
          this.changeKeyNames(res.data.Rows,resultData,this.namesMap) //将表格Rows数据key根据Clos数据对应关系替换成中文
          this.displayChar(res.data,resultData,modelId)
        })


       })

    }
  }
};
</script>
