<template>
  <div class="Chances" :style="{'--delay': + delay}">
      <h3>Chances a Song in Your Library:</h3>
      <PercentBar title="is Accoustic" :percent="audioFeatures.acousticness.value" :color="audioFeatures.acousticness.color" />
      <PercentBar title="is Instrumental" :percent="audioFeatures.instrumentalness.value" :color="audioFeatures.instrumentalness.color" />
      <PercentBar title="is Live" :percent="audioFeatures.liveness.value" :color="audioFeatures.liveness.color" />
      <PercentBar title="is Speaking" :percent="audioFeatures.speechiness.value" :color="audioFeatures.speechiness.color" />
  </div>
</template>

<script>
import PercentBar from '@/components/Analysis/PercentBar.vue'

export default {
    name: 'Chances',
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
.Chances {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
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

h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}

</style>