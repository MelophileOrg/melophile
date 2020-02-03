<template>
  <div class="LibraryAnalysis content-padding-hori" v-resize="onResize">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon overview-icon"/>
      <h1 class="page-title">Your Library Overview</h1>
    </div>
    <Stats/>
    <div class="windows-div">
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <Characteristics v-else :valence="audioFeatures.valence.average" :danceability="audioFeatures.danceability.average" :energy="audioFeatures.energy.average"/>

      <v-skeleton-loader v-if="spotlights == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <TopTracks v-else :tracks="spotlights.tracks"/>

      <v-skeleton-loader v-if="spotlights == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <TopArtists v-else :artists="spotlights.artists"/>
      
    </div>

    <div class="windows-div">
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <Probabilities v-else :instrumentalness="audioFeatures.instrumentalness.average" :acousticness="audioFeatures.acousticness.average" :liveness="audioFeatures.liveness.average"/>

      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <Averages v-else :tempo="audioFeatures.tempo.average" :mode="audioFeatures.mode.average"/>
    </div>


    <div class="windows-div">
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Distribution of Happiness" feature="valence" :bars="audioFeatures.valence.distribution"/>

      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Distribution of Danceability" feature="danceability" :bars="audioFeatures.danceability.distribution"/>
      
      <v-skeleton-loader v-if="audioFeatures == null" type="image" :width="graphWidth" class="elevation-1" style="margin-bottom: 15px; margin-top: 10px;"></v-skeleton-loader>
      <DistributionGraph class="distribution" :width="graphWidth" v-else :height="200" title="Distribution of Energy" feature="energy" :bars="audioFeatures.energy.distribution"/>
    </div>

  </div>
</template>

<script>
import Stats from '@/components/LibraryAnalysis/Stats.vue'
import Characteristics from '@/components/LibraryAnalysis/Characteristics.vue'
import TopTracks from '@/components/LibraryAnalysis/TopTracks.vue'
import TopArtists from '@/components/LibraryAnalysis/TopArtists.vue'
import Probabilities from '@/components/LibraryAnalysis/Probabilities.vue'
import Averages from '@/components/LibraryAnalysis/Averages.vue'
import DistributionGraph from '@/components/Graphs/DistributionGraph.vue'

export default {
  name: 'LibraryAnalysis',
  components: {
    Stats,
    DistributionGraph,
    Characteristics,
    Probabilities,
    Averages,
    TopTracks,
    TopArtists
  },
  data() {
    return {
      audioFeatures: null,
      spotlights: null,
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
    this.spotlights = await this.jimmy.getSpotlights();
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

.windows-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
}

@media only screen and (max-width: 875px) {
    .windows-div {
        justify-content: space-around;
    }
}
</style>