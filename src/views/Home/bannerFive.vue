<template>
  <div style="overflow:hidden"> 
   <div class="title">
     <span>报告分析</span>
     <span class="more-btn">MORE...</span>
   </div>
   <div class="content"  >
        <div id="pieChart" style="height:260px;width:400px"></div> 
   </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts 主题
  export default{
  data() {
    return {
      contentwidth: '',
      contentHeight: '',
    }
  },
  mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('pieChart'));

      // 指定图表的配置项和数据
      var option ={
        title: {
          text: '2016广州建设用地各区情况',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['天河区', '越秀区', '荔湾区', '白云区', '南沙区', '黄浦区','海珠区','番禺区','花都区','从化区','增城区']
        },
        calculable: true,
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            data: [
                { value: 160, name: '天河区' },
                { value: 150, name: '越秀区' },
                { value: 149, name: '荔湾区' },
                { value: 100, name: '白云区' },
                { value: 80, name: '南沙区' },
                { value: 149, name: '黄浦区' },
                { value: 120, name: '海珠区' },
                { value: 70, name: '番禺区' },
                { value: 30, name: '花都区' },
                { value: 20, name: '从化区' },
                { value: 60, name: '增城区' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
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
 

 