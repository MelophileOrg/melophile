<template>
  <div class="TrackAnalysis">
    <Header type="track" :title="track ? (track.name ? track.name : null) : null" :image="track ? (track.image ? track.image : null) : null" :secondaries="track ? (track.artists ? track.artists : null) : null"/>
  </div>
</template>

<script>
import Header from '@/components/Analysis/Header.vue'
//import AudioAnalysisGraph from '@/components/Graphs/AudioAnalysisGraph.vue'
/*
Track = {
  name: String,
  album: {
    name: String,
    image: String,
    relatedTracks: Array
  },
  artist: {
    name: String,
    followers: Number,
    likedTracks: Number
  },
  audioAnalysis: Array,
  audioFeatures: {
    valence: Number,
    energy: Number,
    danceability: Number,
    popularity: Number,
    +.3
    banger: Number,
    key: Number,
    mode: Number,
    tempo: Number,
    duration: Number,
  },
  percentile: {
    valence: Number,
    energy: Number,
    danceability: Number,
  },
  genre: Array,
}
*/

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