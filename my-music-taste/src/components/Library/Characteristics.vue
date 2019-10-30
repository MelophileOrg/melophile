<template>
  <div class="Characteristics" :style="{'--delay': + delay}">
      <h3>Characteristics:</h3>
      <PercentBar title="Happiness" :percent="audioFeatures.valence.value" :color="audioFeatures.valence.color" />
      <PercentBar title="Energy" :percent="audioFeatures.energy.value" :color="audioFeatures.energy.color" />
      <PercentBar title="Danceability" :percent="audioFeatures.danceability.value" :color="audioFeatures.danceability.color" />
  </div>
</template>

<script>
import PercentBar from '@/components/Analysis/PercentBar.vue'

export default {
    name: 'Characteristics',
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Characteristics {
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