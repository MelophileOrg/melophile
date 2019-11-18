<template>
  <div class="Chances" :style="{'--delay': + delay}">
      <h3 class="window-title">Probability a Song is...</h3>
      <PercentBar title="Accoustic" :percent="audioFeatures.acousticness.value" :color="audioFeatures.acousticness.color" />
      <PercentBar title="Instrumental" :percent="audioFeatures.instrumentalness.value" :color="audioFeatures.instrumentalness.color" />
      <PercentBar title="Live" :percent="audioFeatures.liveness.value" :color="audioFeatures.liveness.color" />
      <PercentBar title="Speaking" :percent="audioFeatures.speechiness.value" :color="audioFeatures.speechiness.color" />
      <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
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
            return this.data;
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>