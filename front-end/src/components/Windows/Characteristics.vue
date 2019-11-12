<template>
  <div class="Characteristics window" :style="{'--delay': + delay}">
      <h3 class="window-title">Characteristics:</h3>
      <PercentBar title="Happiness" :percent="audioFeatures.valence.value" :color="audioFeatures.valence.color" />
      <PercentBar title="Energy" :percent="audioFeatures.energy.value" :color="audioFeatures.energy.color" />
      <PercentBar title="Danceability" :percent="audioFeatures.danceability.value" :color="audioFeatures.danceability.color" />
      <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
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