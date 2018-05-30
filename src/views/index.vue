<template>
    <div>
      <app-header class="header"></app-header>
      <router-view class="content"></router-view>
      <app-footer class="footer"></app-footer>
    </div>
</template>
<script>
  import appFooter from '@/components/footer'
  import appHeader from '@/components/header'
  export default {
    components:{ appHeader,appFooter},
    data(){
      return {

      }
    }
  }
</script>
<style lang="less" scoped>
  .header{
    position:absolute;
    left:0;right:0;
    top:0;
  }
  .content{
    background-color: aliceblue;
    overflow: auto;
  }
  .footer{
    position:absolute;
    bottom:0;left:0;right:0;
  }
</style>
