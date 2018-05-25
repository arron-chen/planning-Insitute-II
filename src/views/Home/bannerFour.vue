<template>
  <div style="overflow:hidden"> 
   <div class="title">
     <span>报表分析</span>
     <span class="more-btn">MORE...</span>
   </div>
   <div class="content"  >
         <div id="barChart" style="height:260px;width:400px"></div> 
   </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts 主题
  const animationDuration = 3000
  export default{
  data() {
    return {
      contentwidth: '',
      contentHeight: '',
    }
  },
 mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('barChart'));

      // 指定图表的配置项和数据
      var option ={
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '农用地',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [15029170.48, 15029170.48, 15029170.48, 14962789.524999999, 14939816.867499998, 14939816.867499998,14894505.806874996],
          animationDuration
        }, {
          name: '建设用地',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [1931789.14, 1960748.66, 1990807.14, 2020316.14, 2050099.88, 2079746.25, 2109461.305],
          animationDuration
        }, {
          name: '未利用的',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [1008309.48,1000998.67, 995878.75, 989663.385, 978054.2387499999, 978054.2387499999, 972249.6656249999
],
          animationDuration
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
       myChart.setOption(option);
        window.onresize = function() {
      //重置容器高宽
       myChart.resize();
      };
    },   
  }
</script>
 

 