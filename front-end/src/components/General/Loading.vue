<template>
  <div class="loading">
    <div class="loadingdiv">
        <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
    </div>
  </div>
</template>

<script>


export default {
  name: 'loading',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}
.loadingdiv {
  --height: 27;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--height) * 1px);
}

.loading .bar {
  --delay: 0;
  --speed: .5;
  display: block;
  width: 5px;
  height: 12px;
  margin: 2px;
  border-radius: 1px;
  background-color: white;
  animation: loading calc(var(--speed) * 1s) ease-in-out calc(var(--delay) * var(--speed) * 1s / -4) infinite;
}

@keyframes loading {
  50% {
    height: 25px;
  }  
}
</style>