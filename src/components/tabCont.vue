<template>
    <div style="width:100%;height:100%">
      <div :id='mainID' class="list_box">
        <iframe :id='iframeID'  :style="{width:iframeWidth}" :name='iframeID' :src="iframURL" class="iframepage"></iframe>

        <div :id='splitID' :style="{width:splitWidth}" v-show="ishowScreen" class="splitscreen">
          <div class="toolsbar">
            <button @click="showScreen(false)">关闭</button>
            <button @click="showScreen(true)">打开 </button>
          </div>
          <div class="splitscreencont"></div>
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
      }
    },
    mounted(){

    }
  }
</script>
<style>
</style>
