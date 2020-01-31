<template>
  <div class="LibraryAnalysis content-padding-hori" v-resize="onResize">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon overview-icon"/>
      <h1 class="page-title">Your Overview</h1>
    </div>
    <Stats/>
    <Spotlights/>
    <div class="distribtions flex flex-wrap flex-space-between">
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Happiness Distribution" feature="valence" :bars="audioFeatures.valence.distribution"/>
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Danceability Distribution" feature="danceability" :bars="audioFeatures.danceability.distribution"/>
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Energy Distribution" feature="energy" :bars="audioFeatures.energy.distribution"/>
    </div>
  </div>
</template>

<script>
import Stats from '@/components/LibraryAnalysis/Stats.vue'
import Spotlights from '@/components/LibraryAnalysis/Spotlights.vue'
import DistributionGraph from '@/components/Graphs/DistributionGraph.vue'

export default {
  name: 'LibraryAnalysis',
  components: {
    Stats,
    Spotlights,
    DistributionGraph
  },
  data() {
    return {
      audioFeatures: null,
      windowSize: {x: 0, y: 0},
    }
  },
  methods: {
    onResize() {
      let diff = 225 + 32;
      if (window.innerWidth < 1264) diff = 32;
      this.windowSize = {x: window.innerWidth - diff, y: window.innerHeight};
      console.log(this.windowSize.x);
    },
    formatNumber(val) {
      if (val == null) return "0";
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    },
    graphWidth() {
      if (window.innerWidth < 1264) return this.windowSize.x;
      return (this.windowSize.x / 2.9) - 46;
    }
  },
  async created() {
    await this.onResize();
    this.audioFeatures = await this.jimmy.getAllAudioFeatureData();
  }
}
</script>

<style scoped>
.overview-icon {
  background-image: url('../../assets/nav-bar-icons/bigpicture.svg');
}

.distribution {
  border-radius: 3px;
  margin-bottom: 15px;
  margin-top: 10px;
}
</style>