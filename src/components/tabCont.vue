<template>
    <div style="width:100%;height:100%">
      <div :id='mainID' class="list_box">
        <iframe :id='iframeID'  :style="{width:iframeWidth}" :name='iframeID' :src="iframURL" class="iframepage"></iframe>

        <div :id='splitID' :style="{width:splitWidth}" v-show="ishowScreen" class="splitscreen">
          <div class="toolsbar">
            <button @click="showScreen(false)">关闭</button>
          </div>
          <div class="splitscreencont" v-html="splitCont"></div>
        </div>

      </div>
    </div>
</template>
<script>
  export default {
    data(){
      return {
      }
    },
    props:{
      cont:{},
      moduleId:'',
      iframeWidth:'',
      splitWidth:'',
      ishowScreen:'',
      iframURL:'',
      splitCont:'',
    },
    computed:{
      mainID(){
        return "main"+this.moduleId;
      },
      iframeID(){
        return "iframe"+this.moduleId;
      },
      splitID(){
        return "split"+this.moduleId;
      }
    },
    methods:{
      showScreen(bool){
        window.parent.splitScreen(window.name,bool);
      },

    },
    mounted(){

    }
  }
</script>
<style scoped lang="less">
  .splitscreen{
    .toolsbar{
      width:100%;
      height:30px;
      line-height:30px;
      min-width:200px;
      position:absolute;
      border-bottom:1px solid #efefef;
      padding:2px 3px;
      button{
        height:25px;
        line-height: 25px;
        position:relative;
        left:10px;
        top:2px;
      }
    }
    .splitscreencont{
      position:absolute;
      top:30px;
      bottom:0;
      left:0;right:0;
      background: #1e88e5;

    }

  }
</style>
