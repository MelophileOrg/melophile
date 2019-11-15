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
  position: relative;
}

p {
  position: absolute;
  left: 0;
  top: 0;
  text-align: left;
  color: rgb(var(--red), var(--green), var(--blue), var(--alpha));
  font-size: calc(var(--fontSize) * 1px);
  font-weight: var(--fontWeight);
  text-overflow:unset;
  margin: 0;
}

.scrollingtext:hover p {
  animation: scroll 10s linear 0s infinite;
}

.scrollingtext p.second {
  display: none;
}

.scrollingtext:hover p.second {
  display: inline-block;
  animation: scroll 10s linear -5s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(0%);
  }
  50% {
    opacity: 0;
    transform: translateX(-110%);
  }
  50.00000001% {
    opacity: 0;
    transform: translateX(110%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  } 
}
</style>