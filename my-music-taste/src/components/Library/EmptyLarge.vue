<template>
    <div class="empty">
        <div class="loadingspace" v-for="num in 10" :key="'loading-spaces'+num" :style="{'--delay': + num}">
            <a class="row fake"/>
        </div>
    </div>
</template>

<script>

export default {
  name: 'empty',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media only screen and (max-width: 720px) {
    .row {
      height: 25px !important;
    }
}

.loadingspace {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s) linear, throb-row 2s ease-in-out calc(var(--delay) * .23s + var(--delay) * .1s + .5s) infinite;
}

.row {
--delay: 0;
  overflow: hidden;
  position: relative;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s) linear;
  display: flex;
  padding: 20px 15px;
  width: calc(100vw - 30px);
  height: 60px;
  align-items: center; 
  background: rgba(255, 255, 255, 0.103);
  padding: 20px 15px;
  margin: 3px auto;
}


@keyframes throb-row {
  0%{
    opacity: 1;
  }
  50%{
    opacity: .3;
  }
  100%{
    opacity: 1;
  }
}

</style>
