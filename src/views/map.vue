<template>
  <div id="mapBox">
    <iframe :src=src frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  data(){
    return{
      src:''
    }
  },
  mounted() {
    this.src='http://'+window.location.hostname+':9000/Index.html'
    var winwid, winhgt, mapBox;

    function setWIDHGT() {
      winwid = $(window).width() || document.body.clientWidth,
        winhgt = $(window).height() || document.body.clientHeight;

      if (winwid <= 1280) {
        winwid = 1280;
      }

      console.log('浏览器的宽高：' + winwid, winhgt);
    }
    setWIDHGT();
    mapBox = $("#mapBox")
    mapBox.height(winhgt - 105)
    $(window).resize(function() {
      setWIDHGT();
      mapBox.height(winhgt - 105)
    });
  }
}
</script>
<style lang="less" scoped>
#mapBox {
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>



