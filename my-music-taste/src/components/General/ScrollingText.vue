<template>
  <div class="scrollingtext" :style="{'--fontSize': + fontSize, '--fontWeight': + fontWeight, '--red': + red, '--blue': + blue, '--green': + green, '--alpha': + alpha}">
    <p>{{text}}</p>
    <p class="second">{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'scrollingtext',
  props: {
    text: String,
    fontSize: Number,
    fontWeight: String,
    red: Number,
    blue: Number,
    green: Number,
    alpha: Number,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scrollingtext {
  --fontSize: 16;
  --fontWeight: "bolder";
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 1;
  display: block;
  width: 100%;
  height: calc(var(--fontSize) * 1px);
  overflow: hidden;
  position: relative;
  width: 200px;
}

p {
  position: absolute;
  color: rgb(var(--red), var(--green), var(--blue), var(--alpha));
  font-size: calc(var(--fontSize) * 1px);
  font-weight: var(--fontWeight);
  animation: scroll 10s linear infinite;
  margin: 0;
}

p.second {
  animation: scroll 10s linear 5s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(0%);
  }
  50% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50.00000001% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  } 
}
</style>