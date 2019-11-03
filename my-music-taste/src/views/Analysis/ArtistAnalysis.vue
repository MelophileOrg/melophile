<template>
  <div id="main-flex" class="artistanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

        <div class="window" :style="{'--delay': 0}">
          <div v-if="artistData != null" class="flex">
            <div class="flex">
              <div class="col">
                <div id="artist-image" :style="{backgroundImage: 'url(\'' + artistData.image + '\')'}"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name">{{artistData.name}}</h1>
                <h2 >{{formatNumber(artistData.followers)}} Followers</h2>
                <h2 v-if="progress.libraryLoaded">{{songsSaved}}</h2>
                <h2 v-if="!progress.libraryLoaded">Finding Saved Songs</h2>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Loading from '@/components/General/Loading.vue'
import GoBackSearch from '@/components/Library/GoBackSearch.vue'

export default {
  name: 'artistanalysis',
  components: {
      NavBar,
      Loading,
      GoBackSearch,
  },
  data() {
      return {
        artistData: null,
        libraryLoaded: false,
      }
  },
  methods: {
    formatNumber(num) {
      let millions = Math.floor(num / 1000000);
      let thousands = Math.floor(num / 1000);
      let remainder = num % 1000;
      let zeros = "";
      let zeros2 = "";
      if (thousands < 100)
          zeros2 += "0"
      if (thousands < 10)
          zeros2 += "0"
      if (remainder < 100)
          zeros += "0"
      if (remainder < 10)
          zeros += "0"
      if (millions > 0)
        return millions + "," + zeros2 + thousands + "," + zeros + remainder;
      if (thousands > 0) 
          return thousands + "," + zeros + remainder;
      return remainder;
    },
  },
  computed: {
    progress() {
      return this.$store.state.progress;
    },
    songsSaved() {
      if (this.trackData.artists[this.artistData.id].id in this.$store.state.artists) {
        return this.$store.state.artists[this.artistData.id].tracks.length + " Songs Saved";
      }
      return "No Songs Saved";
    },
  },  
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    this.artistData = await this.$store.dispatch('artistAnalysis', this.$route.params.id);
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
@media screen and (max-width: 720px) {
  #artist-image {
    width: 70px !important;
    height: 70px !important;
    margin-right: 20px;
  }
}

#artist-image {
  display: block;
  width: 100px;
  height: 100px;
  background-size: auto 100%;
  background-position: center center;
  margin-right: 20px;
}


h1 {
  font-size: 1.6em;
  display: block;
  color: white;
  text-align: left;
  margin: 0px 0px;
  line-height: 30px;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
    
}

h2 {
  font-size: 1em;
  color: rgba(255, 255, 255, 0.568);
  text-align: left;
  margin: 0;
  margin-top: 10px;
  max-width: calc(100% - 5px);
  text-transform: capitalize;
      text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>