<template>
  <div class="TrackAnalysis">
    <TrackHeader :track="track"/>
    <AudioAnalysisGraph v-if="track != null" :width="200" :height="100" :audioAnalysis="track.audioAnalysis"/>
  </div>
</template>

<script>
import TrackHeader from '@/components/TrackAnalysis/TrackHeader.vue'
import AudioAnalysisGraph from '@/components/Graphs/AudioAnalysisGraph.vue'
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
    TrackHeader,
    AudioAnalysisGraph
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
    this.trackID = this.$router.currentRoute.params.id;
    this.track = await this.jimmy.getTrackAnalysis(this.trackID);
    console.log(this.track);
  }
}
</script>