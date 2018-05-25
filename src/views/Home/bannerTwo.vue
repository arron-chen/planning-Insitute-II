<template>
  <div style="overflow:hidden"> 
   <div class="title">
     <span>报告</span>
     <span class="more-btn" @click='toReport()'>MORE...</span>
   </div>
   <div class="content">
        <ul class="report-list">
          <li v-for="item in list"  @click='toReport(item)'><a>{{item.label}}</a><span class="new-label">最新</span></li>
        </ul>
   </div>
  </div>
</template>
<script>
  import api from '../../fetch/index'
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts 主题
  export default{
  data() {
    return {
      contentwidth: '',
      contentHeight: '',
      list:[]
    }
  },
  mounted() {
     api.fetchGetReportFileName()
      .then(res=>{
        this.list = res.data
      })
  
    },  
    methods:{
    toReport(a){
       this.$root.eventHub.$emit('toTab',{name:'报告',data:a});
    }
   } 
  }
</script>

<style scoped>
    ul{
      margin:0px;
      padding: 0px;
    }
    .report-list{
      padding: 15px;
    }
   .report-list li{
      list-style-type: none;
      height: 40px;
      line-height: 40px;
      margin:0px;
      padding: 0px;
    }
  .report-list li a:hover{
    color: #26c6da;
    cursor: pointer;
  }
   .new-label{
    background: #eab136;
    color: #fff;
    font-size: 12px;
    padding: 3px 5px  3px 5px;
    border-radius: 3px;
    margin-left: 15px;
  }
</style>
 

 