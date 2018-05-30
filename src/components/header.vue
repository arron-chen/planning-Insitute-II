<template>
    <div class="footer">
      <router-link to="/list" class="header-title">菜单目录</router-link>
    </div>
</template>
<script>
  export default {

  }
</script>
<style lang="less" scoped>
    .header{
      height:48px;
      line-height: 48px;
      background: rgba(0,0,0,.8);
      color:#fff;
      .header-title{
        padding:0 32px;
        float:left;
        color:#fff;
        text-decoration: none;
      }
      .header-menu{
        float:right;
        margin-right:32px;
      }
    }
</style>
