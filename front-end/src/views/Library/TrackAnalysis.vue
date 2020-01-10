<template>
  <div class="TrackAnalysis">

  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
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

  },
  data() {
      return {
          trackId: null,
      }
  }, 
  created() {
      this.trackId = this.$router.currentRoute.params.id;
  }
}
</script>