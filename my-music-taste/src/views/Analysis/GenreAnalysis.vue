<template>
  <div id="main-flex" class="genreanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import GoBackSearch from '@/components/Library/GoBackSearch.vue'

export default {
  name: 'genreanalysis',
  components: {
      NavBar,
      GoBackSearch,
  },
  data() {
      return {
        artistData: null,
      }
  },
  methods: {

  },
  computed: {

  },  
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    // this.trackData = await this.$store.dispatch('songAnalysis', this.$route.params.id);
    // this.trackData.banger = await this.$store.dispatch('bangerCalc', {tempo: this.trackData.tempo, danceability: this.trackData.danceability, energy: this.trackData.energy});
    // this.audioFeaturesDone = true;
    // this.audioAnalysisReady = true;
    // await this.getArtistDetails();
    // if (this.progress.tracksLoaded) {
    //   this.trackData.percentiles = await this.$store.dispatch('getPercentiles', {
    //     valence: this.trackData.valence, 
    //     energy: this.trackData.energy, 
    //     danceability: this.trackData.danceability, 
    //     banger: this.trackData.banger, 
    //   });
    //   this.percentilesReady = true;
    // }
    // else {
    //   this.interval = setInterval(this.checkTracksLoaded, 2000);
    // }
  }
}

</script>

<style scoped>

</style>