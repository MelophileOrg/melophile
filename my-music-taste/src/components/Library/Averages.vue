<template>
  <div class="Averages" :style="{'--delay': + delay}">
      <h3>Averages:</h3>
      <PercentBar title="Tempo" :percent="audioFeatures.tempo.value / 208" :color="audioFeatures.tempo.color" />
      <PercentBar title="Major" :percent="mode.value" :color="mode.major" />
      <PercentBar title="Minor" :percent="1 - mode.value" :color="mode.minor" />
      <PercentBar title="Volume" :percent="(audioFeatures.loudness.value + 50) /  50" :color="audioFeatures.loudness.color" />
  </div>
</template>

<script>
import PercentBar from '@/components/Analysis/PercentBar.vue'

export default {
    name: 'Averages',
    components: {
        PercentBar
    },
    props: {
        delay: Number,
    },
    computed: {
        audioFeatures() {
            return this.$store.state.audioFeatures;
        },
        mode() {
          return this.$store.state.mode;
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Averages {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 20px 20px;
    padding: 20px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
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