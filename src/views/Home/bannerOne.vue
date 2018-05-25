<template>
  <div style="overflow:hidden"> 
   <div class="title">
     <span>趋势分析</span>
     <span class="more-btn" @click='toTrendAnalysis'>MORE...</span>
   </div>
   <div class="content" id="chartContent">
        <p style="text-align:center;font-size:22px;color:#777">{{title}}</p>
        <div id="lineChart" style="height:250px;width:800px"></div>
   </div>
  </div>
</template>
<script>
  import api from '../../fetch/index'
  import echarts from 'echarts'
  import { mapMutations, mapActions, mapGetters } from 'vuex'

  require('echarts/theme/macarons') // echarts 主题
  export default{
  data() {
    return {
      contentwidth: '',
      contentHeight: '',
      charData:'',
      xName:'',
      yName:'',
      namesMap:[],
      yData:'',
      xData:'',
      seriesData:'',
      barData:'',
      charType:'line',
      title:' ',
      forceND:''
    }
  },
  mounted() {
      this.getModelData()
  },
  methods :{
    //请求获取模型数据
      getModelData(){
            api.fetchHomePageTrendChart()
            .then(res=>{
              console.log(res.data)
              this.charData = res.data
              this.xName = res.data.XDW
              this.yName = res.data.YDW
              this.title = res.data.Name 
              this.forceND = res.data.forceND.toString()
              for(var i = 0; i<this.charData.Cols.length;i++){
                       var key = this.charData.Cols[i].COLUMN_NAME
                       var val = this.charData.Cols[i].COMMENTS
                       this.namesMap[key] = val;
                      }
               var resultData = []
                //将表格Rows数据key根据Clos数据对应关系替换成中文
                this.changeKeyNames(this.charData.Rows,resultData,this.namesMap) 
                this.displayChar(this.charData,resultData) 
            })               
      },
    //将Rows数据映射成中文
      changeKeyNames(data,resultData,namesMap){
        var _ = require('lodash');
        for(var i = 0;i<data.length;i++){
          var rightData = _.transform(data[i], function(result, value, key) {
            result[namesMap[key] || key] = value;
          })
          resultData.push(rightData)
        }
      },
    //数据处理展示模型
      displayChar(data,dataRows){
        var xField = data.XField
        this.yData = data.YField
        //y轴数据处理
        this.yData = this.yData.split(';')
        for(var i = 0 ;i<this.yData.length;i++){
          if(this.yData[i] == "" || typeof(this.yData[i]) == "undefined")
             {this.yData.splice(i,1);i= i-1;}
        }
        var yDataArr = []
        for(var i = 0;i<this.yData.length;i++){
          yDataArr.push(this.namesMap[this.yData[i]])
        }
        this.yData = yDataArr

        //获取x轴数据
        this.xData =[]
        for(var i=0;i< data.Rows.length;i++){
          this.xData.push(data.Rows[i][xField])
        }

        //根据y轴数据获取柱状数据
        this.seriesData = []
        for(var k = 0; k < this.yData.length; k++){ 
          this.barData = []
          for(var i=0;i<dataRows.length;i++){
            this.barData.push(dataRows[i][this.yData[k]]) 
          }
          this.seriesData.push({name : this.yData[k], type : this.charType, data : this.barData,
            markLine:{
              data:[{xAxis:this.forceND}],

               itemStyle:{
                symbol:'none',
            
              /* normal:{lineStyle:{type:'solid',color:'#000'},label:{show:false,position:'left'}}*/
            },
          //  data:[[{name:'ss',coord:[2016,0]},{coord:[2016,133333333]}]]
          }}) // bar 数据
        }   
        // console.log('this.seriesData:'+this.seriesData)
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('lineChart'));
        // 指定图表的配置项和数据
        var option = {
          tooltip : {
            trigger : 'axis',
            axisPointer : {
              type : 'cross',
              crossStyle : {
                color : '#999'
              }
            }
          },
          toolbox : {
            feature : {
              // dataView : {show : true, readOnly : false},
              magicType : {show : true, type : ['line', 'bar']},
              // restore : {show : true},
             // saveAsImage : {show : true}, 
            }
          },
          legend : {
            data : this.yData
          },
          xAxis : [
            {
              name : this.xName,
              type : 'category',
              data : this.xData,
              axisPointer : {
                type : 'shadow'
              }
            }
          ],
          yAxis : [{name : this.yName,}],
          series : this.seriesData
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = function(){
          //重置容器高宽
          myChart.resize();
        };
      },
      toTrendAnalysis(){
        this.$root.eventHub.$emit('toTab','趋势分析');
      }
    }  
  }
</script>
 

 