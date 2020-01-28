<template>
    <div class="AudioAnalysisGraph" :style="{'--width': + width, '--height': + height}">
        <h3>Audio Analysis</h3>  
        <div class="audio-analysis-graph" :style="{'--num': + audioAnalysis.length}">
            <div class="audio-analysis-bar" v-for="(bar, index) in audioAnalysis" :style="{'--value': + bar.loudness_max, '--red': + bar.red, '--green': + bar.green, '--blue': + bar.blue, '--index': + index}" :key="'audio-analysis'+index">
                <!-- <p>{{time(bar.start)}}</p> -->
            </div>
        </div>
        <div class="flex flex-space-between">
            <p>Height: Volume</p>
            <p>Color: Pitch</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AudioAnalysisGraph',
  props: {
      audioAnalysis: Array,
      width: Number,
      height: Number,
  },
}
</script>

<style scoped>
.AudioAnalysisGraph {
    --width: 0;
    --height: 0;
    display: block;
    width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
}

.audio-analysis-graph {
    --num: 0;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 400px;
    height: 187px;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    margin: 10px 0px;
}

.audio-analysis-bar {
    --value: 0;
    --red: 240;
    --green: 193;
    --blue: 111;
    --index: 0;
    display: block;
    width: calc((100% / var(--num)) - 1px);
    height: calc(var(--height) * var(--value) * 1px);
    background-color: rgba(var(--red), var(--green), var(--blue), .9);
    border-radius: 3px;
    position: relative;
    animation: bar-graph-slide .5s ease-out calc(var(--value) * 1s + var(--index) * .005s - .5s), hide calc(var(--value) * 1s + var(--index) * .005s - .5s);
}

</style>