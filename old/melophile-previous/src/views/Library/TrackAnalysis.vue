<template>
  <div class="TrackAnalysis">
    <Header @tabChange="changeTab" type="track" :title="track ? (track.name ? track.name : null) : null" :image="track ? (track.image ? track.image : null) : null" :secondaries="track ? (track.artists ? track.artists : null) : null"/>
    <div v-if="tab == 0">
      <h1>Overview</h1>
    </div>
    <div v-if="tab == 1">
      <h1>Analysis</h1>
    </div>
    <div v-if="tab == 2">
      <h1>Compairison</h1>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Analysis/Header.vue'
// import AudioAnalysisGraph from '@/components/Graphs/AudioAnalysisGraph.vue'

export default {
  name: 'TrackAnalysis',
  components: {
    Header,
    //AudioAnalysisGraph
  },
  data() {
      return {
          trackID: null,
          track: null,
          tab: 0,
      }
  }, 
  method: {
    changeTab(tab) {
      console.log("CHANGE TAB");
      console.log(tab);
      this.tab = tab;
    }
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    }
  },
  async created() {
    try {
      this.trackID = this.$router.currentRoute.params.id;
      this.track = await this.jimmy.getTrackData(this.trackID);
      this.track.audioFeatures = this.jimmy.getTrackFeatures(this.trackID);
      this.track.analysis = this.jimmy.getTrackAnalysis(this.trackID);
    console.log(this.track);
    } catch(error) {
      console.log(error);
    }
  }
}
</script>