<template>
  <div class="Characteristics" :style="{'--delay': + delay}">
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
.Characteristics {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 30px 30px !important;
    position: relative;
    padding: 30px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
}

@media screen and (max-width: 720px) {
  .Characteristics {
    padding: 22px !important;
  }
}


</style>