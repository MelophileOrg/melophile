<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script>
if (process.browser) {
  var radar = require('@/js/Shift.js')
}


// import particlesJS from 'particles.js';

export default {
  data() {
    return {
      message: ""
    }
  },
  mounted() {
    const P5 = require('p5');
    new P5(radar.main);
    // particlesJS.load('particles-js', '../assets/particles.json', function() {
    // console.log('callback - particles.js config loaded');
    // });
  },
  methods: {
  },
  created() {
    
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