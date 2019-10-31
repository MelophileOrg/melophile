<template>
  <div class="timeline" :style="{'--graphdelay': delay}">
    <div>
      <h3>{{title}}</h3>
      <Loading v-if="!override"/>
      <div v-if="override" class="graph" :style="{'--max': + findMax(bars), '--red': + color.red, '--green': + color.green, '--blue': + color.blue}">
        <div class="graph-bar time" v-for="(bar, index) in bars" :key="title+ '-timeline' + index" :class="{toolow: bar.value < findMax(bars) / 10}" :style="{'--num': bars.length,'--height': + bar.value}"><p>{{bar.tag}}</p><p class="hover-graph">{{findDate(bars.length - index)}}</p></div>
        <p class="yAxis">{{y_axis}}</p>
      </div>
      <div class="graph-labels">
        <p>{{findDate(bars.length - 1)}}</p>
        <p>{{findDate(0)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/General/Loading.vue'

export default {
  name: 'timeline',
  components: {
    Loading
  },
  props: {
    title: String,
    delay: Number,
    bars: Array,
    y_axis: String,
    color: Object,
    override: Boolean,
    max: Number,
  },
  methods: {
    findDate(months) {
      let now = new Date();
      let nowMonth = now.getMonth();
      let year = 0;
      nowMonth -= months;
      while (nowMonth < 0) {
        year += 1;
        nowMonth = 12 + nowMonth;
      } 
      nowMonth += 1;
      let returnYear = (now.getFullYear() - year) % 100;
      return nowMonth + "/" + returnYear;
    },
    findMax(array) {
      if (this.max != -1) {
        return this.max;
      }
      let max = 0;
      for (var i = 0; i < array.length; i++)
      {
        if (array[i].value > max)
          max = array[i].value;
      }
      return max;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.timeline {
  --graphdelay: 0;
  animation: slide-up .5s ease calc(var(--graphdelay) * .1s), hide calc(var(--graphdelay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 22px 22px;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}

.graph-bar.time:hover p {
  position: absolute;
  text-align: center;
  display: block;
  top: -50px;
  width: 50px;
  margin: 0;
  padding: 3px;
  height: 14px;
  z-index: 100;
  color: white;
  background: rgba(0, 0, 0, 0.842);
  transform: translateY(-0px) translateX(-25px);
}


.graph-bar.time:hover p.hover-graph {
  transform: translateY(20px) translateX(-25px);
}

.graph {
  --max: 0;
  --red: 0;
  --green: 0;
  --blue: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  position: relative;
  max-width: 400px;
  width: 100%;
  height: 200px;
  background: rgba(226, 226, 226, 0.041);
  border-radius: 5px;
  padding-top: 10px;
}

.graph-labels {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  width: 400px;
}

.instructions {
  display: block;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: -23px;
  color: rgba(255, 255, 255, 0.082) !important;
}

.graph-labels p {
  margin: 5px 0;
  margin-top: 15px;
  font-size: .8em;
 
  color: rgba(250, 246, 246, 0.404);
  
  transform: translateY(-5px);
}



.yAxis {
  position: absolute;
  transform: rotate(-90deg);
  color: rgba(250, 246, 246, 0.404);
  font-size: .8em;
  left: -60px;
  top: 80px;

}

p {
  display: inline-block;
}

.graph-bar.toolow p {
  transform: translateY(-25px);
}

.graph-bar {
  --height: 0;
  display: block;
  width: calc(10% - 2px - 10px);
  margin: 0px 5px;
  height: calc((var(--height) / var(--max)) * 100% - 5px);
  padding-top: 5px;
  background: rgba(var(--red), var(--green), var(--blue), .9);
  border: 1px solid rgba(255, 255, 255, 0.151);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  animation: bar-graph-slide .5s ease-out calc(var(--graphdelay) * .1s), hide ;
}

.graph-bar p{
  color: rgba(255, 255, 255, 0.692);
  font-weight: bolder;
  margin: 0;
  font-size: .5em;
  transform: translateX(-1px);
}

@media screen and (min-width: 535px) {
  .graph-bar p {
    transform: translateX(-0px);
    font-size: .8em;
  }
}

@keyframes bar-graph-slide {
  from {
    height: calc((var(--height) / var(--max)) * 0% - 5px);
    color: rgba(255, 255, 255, 0);
  }
}

.graph-bar.time:hover p {
  position: absolute;
  text-align: center;
  display: block;
  top: -50px;
  width: 50px;
  margin: 0;
  padding: 3px;
  height: 14px;
  z-index: 100;
  color: white;
  background: rgba(0, 0, 0, 0.842);
  transform: translateY(-0px) translateX(-25px);
}

.graph-bar.time {
  --num: 0;
  width: calc((100% / var(--num)) - 4px) !important;
  margin: 0px 0px;
  position: relative;
}

.graph-bar.time p {
  display: none;
}

h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}
</style>