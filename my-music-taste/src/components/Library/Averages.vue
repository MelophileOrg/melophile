<template>
  <div class="Averages" :style="{'--delay': + delay}">
      <h3 class="window-title">Averages:</h3>
      <PercentBar title="Tempo" type="tempo" :percent="audioFeatures.tempo.value / 208" :color="audioFeatures.tempo.color" />
      <PercentBar title="Major" :percent="mode.value" :color="mode.major" />
      <PercentBar title="Minor" :percent="1 - mode.value" :color="mode.minor" />
      <PercentBar title="Volume" type="volume" :percent="(audioFeatures.loudness.value + 50) /  50" :color="audioFeatures.loudness.color" />
      <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
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
        save: Boolean,
        state: Boolean,
        profile: Boolean,
        data: Object,
    },
    methods: {
        toggleSave() {
            this.$emit('toggleSave');
        }
    },
    computed: {
        audioFeatures() {
            if (!this.profile)
                return this.$store.state.audioFeatures;
            return this.data.audioFeatures;
        },
        mode() {
            if (!this.profile)
                return this.$store.state.mode;
            return this.data.mode;
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
    margin: 30px 30px !important;
    padding: 20px;
    position: relative;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
}

</style>