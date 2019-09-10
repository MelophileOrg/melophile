<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script>
if (process.browser) {
  var radar = require('@/js/Radar.js')
}

export default {
  data() {
    return {
      message: ""
    }
  },
  mounted() {
    const P5 = require('p5');
    new P5(radar.main);
    // NOTE: p5.jsからのコールバックを受け取る
    radar.setDelegate(this.callbackOnP5);
  },
  methods: {
    callbackOnP5: function(timeStr) {
      this.message = timeStr;
    }
  }
}
</script>

<style>
#p5Canvas {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -100;
}
</style>