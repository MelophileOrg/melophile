<template>
  <div id="main-flex" class="songanalysis">
    <NavBar/>
    <p>{{genres}}</p>
    <div v-if="false" id="main">
      <div id="song" class="window flex" :style="{'--delay': 0}">
        <div class="col">
            <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
        </div>
        <div class="col fit">
            <h1>{{trackData.name}}</h1>
            <div id="artists">
                <h3 v-for="artist in trackData.artists" :key="artist.name">{{artist.name}}</h3>
            </div>
            <h2>{{trackData.album.name}}</h2>
        </div>
      </div>
      <div id="artist" class="window" :style="{'--delay': 1}">
          <div v-if="artistDone" class="flex">
              <div class="col">
                  <div id="track-image" :style="{backgroundImage: 'url(\'' + artist.images[0].url + '\')'}"/>
              </div>
              <div class="col fit">
                  <h1>{{artist.name}}</h1>
                  <h2>{{artist.followers.total}} Followers</h2>
                  <h2 v-if="libraryData != null">{{findArtistSongsSaved(artist.name)}} Songs Saved</h2>
                  <h2>{{artist.genres[0]}}</h2>
              </div>
          </div>
      </div>
      <div id="characteristics" class="window" :style="{'--delay': 2}">
          <h3>Song Characteristics</h3>
          <div class="row stat">
              <h4 class="bar-title">Happiness</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + trackData.audioFeatures.valence, '--red': + barColors[0].red, '--green': + barColors[0].green, '--blue': + barColors[0].blue}"/>
              </div>
              <h4 class="value">{{percent(trackData.audioFeatures.valence)}}</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Energy</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + trackData.audioFeatures.energy, '--red': + barColors[1].red, '--green': + barColors[1].green, '--blue': + barColors[1].blue}"/>
              </div>
              <h4 class="value">{{percent(trackData.audioFeatures.energy)}}</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Danceability</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + trackData.audioFeatures.danceability, '--red': + barColors[2].red, '--green': + barColors[2].green, '--blue': + barColors[2].blue}"/>
              </div>
              <h4 class="value">{{percent(trackData.audioFeatures.danceability)}}</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Popularity</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + (trackData.popularity / 100), '--red': + barColors[4].red, '--green': + barColors[4].green, '--blue': + barColors[4].blue}"/>
              </div>
              <h4 class="value">{{trackData.popularity}}%</h4>
          </div>
      </div>

      <div id="stats" class="window" :style="{'--delay': 3}">
          <h3>Song Statistics</h3>
          <div class="row stat">
              <h4 class="bar-title">Tempo:</h4>
              <h4 class="value">{{trackData.audioFeatures.tempo}} BPM</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Key:</h4>
              <h4 class="value">{{keyTell(trackData.audioFeatures.key)}}</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Mode:</h4>
              <h4 class="value">{{mode(trackData.audioFeatures.mode)}}</h4>
          </div>
          <div class="row stat">
              <h4 class="bar-title">Duration:</h4>
              <h4 class="value">{{Math.round(trackData.audioFeatures.duration_ms / 6000) / 10}} min</h4>
          </div>
      </div>

      <div id="banger" class="window" :style="{'--delay': 4}">
          <h3>Is This a Banger?</h3>  
          <div class="row stat">
              <h4 class="bar-title">Banger-Level</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + banger, '--red': + barColors[3].red, '--green': + barColors[3].green, '--blue': + barColors[3].blue}"/>
              </div>
              <h4 class="value">{{Math.round(banger * 100)}}%</h4>
          </div>
          <h3 id="banger-conclusion">{{bangerConclusion}}</h3>
      </div>

      <div id="banger" class="window"  :style="{'--delay': 5}">
          <h3 class="nomargin">Audio Analysis</h3>  
          <div class="loading" v-if="!audioAnalysisReady">
              <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
          </div>
          <div v-if="audioAnalysisReady" class="graph" :style="{'--numBars': + audioAnalysisSegments}">
              <div class="graph-bar" v-for="(bar, index) in trackData.audioAnalysis.segments" :style="{'--height': + bar.loudness_max, '--red': + bar.red, '--green': + bar.green, '--blue': + bar.blue,}" :key="'audio-analysis'+index">
                  <p>{{time(bar.start)}}</p>
              </div>
          </div>
          <p v-if="audioAnalysisReady" class="graph-key">Height: Volume - Color: Pitch</p>
      </div>

      <div v-if="audioFeaturesDone" id="comparisons" class="window" :style="{'--delay': 6}">
          <h3>Compaired to Your Saved (Percentile)</h3>
          <div v-if="percentileDataReady" class="row stat">
              <h4 class="bar-title">Happier Than</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + percentileData.valence, '--red': + barColors[0].red + 20, '--green': + barColors[0].green + 20, '--blue': + barColors[0].blue + 20}"/>
                  <div class="fill excess" :style="{'--percent': + 1 - percentileData.valence, '--red': + barColors[0].red - 20, '--green': + barColors[0].green - 20, '--blue': + barColors[0].blue - 20}"/>
              </div>
              <h4 class="value">{{percent(percentileData.valence)}}</h4>
          </div>
          <div v-if="percentileDataReady" class="row stat">
              <h4 class="bar-title">Energy</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + percentileData.energy, '--red': + barColors[1].red + 20, '--green': + barColors[1].green + 20, '--blue': + barColors[1].blue + 20}"/>
                  <div class="fill excess" :style="{'--percent': + 1 - percentileData.energy, '--red': + barColors[1].red - 20, '--green': + barColors[1].green - 20, '--blue': + barColors[1].blue - 20}"/>
              </div>
              <h4 class="value">{{percent(percentileData.energy)}}</h4>
          </div>
            <div v-if="percentileDataReady" class="row stat">
              <h4 class="bar-title">Danceable</h4>
              <div class="stat-bar">
                  <div class="fill" :style="{'--percent': + percentileData.danceability, '--red': + barColors[2].red + 20, '--green': + barColors[2].green + 20, '--blue': + barColors[2].blue + 20}"/>
                  <div class="fill excess" :style="{'--percent': + 1 - percentileData.danceability, '--red': + barColors[2].red - 20, '--green': + barColors[2].green - 20, '--blue': + barColors[2].blue - 20}"/>
              </div>
              <h4 class="value">{{percent(percentileData.danceability)}}</h4>
          </div>
      </div>
      <h1 id="instructions" @click="libraryAnalysis" :style="{'--delay': 7}" v-if="!audioFeaturesDone">Run Library Analysis for Personalized Data</h1>
    
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'songanalysis',
  components: {
    NavBar
  },
  data() {
    return {
      trackData: null,
    }
  },
  methods: {

    },
    computed: {
      genres(){
        return this.$store.state.genres;
      }
    },  
    async created() {
      this.trackData = await this.$store.dispatch('songAnalysis', this.$route.params.id);
      console.log(this.genres);
      console.log(this.$store.state.topSaved.genres);
    }
}

</script>

<style scoped>
p {
  color: white;
}
</style>