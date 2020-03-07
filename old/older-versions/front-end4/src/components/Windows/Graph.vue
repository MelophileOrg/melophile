<template>
  <div class="graphcomp" :style="{'--delay': delay}">
    <p @click="more" v-if="instructions != ''" class="instructions">{{instructions}}</p>
    <h3 v-if="zero" class="window-title">{{title}}</h3>
    <div v-if="!zero">
      <h3 class="window-title">{{title}}</h3>
      <Loading v-if="!override"/>
      <div v-if="override" class="graph" :style="{'--max': + findMax(bars), '--red': + color.red, '--green': + color.green, '--blue': + color.blue}">
        <div class="graph-bar" v-for="(bar, index) in bars" :key="title+'-bargraph-'+index" :class="{toolow: bar.value < findMax(bars) / 8}" :style="{'--height': + bar.value}"><p :class="{thousands: bar.value > 999}">{{bar.tag}}</p></div>
        <p v-if="y_axis != ''" class="yAxis">{{y_axis}}</p>
      </div>
      <div v-if="override" class="graph-labels">
        <p>{{min_tag}}</p>
        <p>{{max_tag}}</p>
      </div>
    </div>
    <h4 v-if="zero">No Songs Liked</h4>
    <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
  </div>
</template>

<script>
import Loading from '@/components/General/Loading.vue'

export default {
  name: 'graphcomp',
  components: {
    Loading
  },
  props: {
    title: String,
    delay: Number,
    // {value: Number, tag: String}
    bars: Array,
    max_tag: String,
    min_tag: String,
    y_axis: String,
    color: Object,
    instructions: String,
    override: Boolean,
    zero: Boolean,
    save: Boolean,
    state: Boolean,
  },
  methods: {
    toggleSave() {
      this.$emit('toggleSave');
    },
    findMax(array) {
      let max = 0;
      for (var i = 0; i < array.length; i++)
      {
        if (array[i].value > max)
          max = array[i].value;
      }
      return max;
    },
    more() {
      this.$emit("more");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graphcomp {
  padding-bottom: 20px;
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
  background: rgba(226, 226, 226, 0.048);
  border-radius: 5px;
  padding-top: 10px;
}

@media screen and (max-width: 720px) {
  .graph {
    height: 150px;
  }

  .graph-bar p {
    transform: translateX(0px);
    font-size: .65em !important;
  }

  .instructions {
    font-size: 10px !important;
  }

  .yAxis {
    transform: rotate(-90deg) translateX(22px) translateY(-2px) !important;
  }

  .thousands {
    transform: translateX(-3px) translateY(-0px) !important;
  }
}

@media screen and (min-width: 720px) {
  .thousands {
    transform: translateX(-1.5px) translateY(0px) !important;
  }
}



.graph-labels {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.instructions {
  display: block;
  width: 100%;
  text-align: center;
  margin: 0;
  font-size: 1em !important;
  color: rgba(255, 255, 255, 0.11) !important;
  position: absolute;
  bottom: 10px;
  left: 0px;
  cursor: pointer;
  transition: all .3s ease;
}

.instructions:hover {
  color: white !important;
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
  color: rgba(250, 246, 246, 0.137);
  font-size: .8em;
  left: -58px;
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
  width: calc(10% - 2px - 3%);
  margin: 0px 1.5%;
  height: calc((var(--height) / var(--max)) * 100% - 5px);
  padding-top: 5px;
  background: rgba(var(--red), var(--green), var(--blue), .9);
  border: 1px solid rgba(255, 255, 255, 0.151);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  animation: bar-graph-slide .5s ease-out calc(var(--delay) * .1s + .4), peekaboo calc(var(--delay) * .1s + .4);
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

h4 {
  margin-bottom: 0px;
  color: rgba(255, 255, 255, 0.336);
  padding: 10px;
  background-color: rgba(7, 7, 7, 0.336);
  border-radius: 10px;
}
</style>