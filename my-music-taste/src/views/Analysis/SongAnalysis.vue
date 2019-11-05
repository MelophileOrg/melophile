<template>
  <div id="main-flex" class="songanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

        <div id="song" class="window" :style="{'--delay': 0}">
          <div v-if="trackData != null" class="flex">
            <div class="col">
                <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
            </div>
            <div  class="col fit">
                <h1>{{trackData.name}}</h1>
                <div id="artists">
                    <h3>{{trackData.artists[0].name}}</h3>
                </div>
                <h2>{{trackData.album.name}}</h2>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <div id="artist" class="window" :style="{'--delay': 1}">
          <div v-if="artistDone" class="flex">
            <div class="flex">
              <div class="col">
                <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.artist.images[0].url + '\')'}"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name" @click="goToArtist">{{trackData.artist.name}}</h1>
                <h2 >{{formatNumber(trackData.artist.followers.total)}} Followers</h2>
                <h2 v-if="progress.artistsLoaded">{{songsSaved}}</h2>
                <Loading v-if="!progress.artistsLoaded"/>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <div class="window" :style="{'--delay': + 2}">
          <h3  class="window-title" v-if="artistDone">Song Characteristics:</h3>
          <div v-if="audioFeaturesDone">
            <PercentBar title="Happiness" :percent="trackData.valence" :color="audioFeatures.valence.color" />
            <PercentBar title="Energy" :percent="trackData.energy" :color="audioFeatures.energy.color" />
            <PercentBar title="Danceability" :percent="trackData.danceability" :color="audioFeatures.danceability.color" />
            <PercentBar title="Popularity" :percent="trackData.popularity / 100" :color="audioFeatures.instrumentalness.color" />
          </div>
          <Loading v-else/>
        </div>

        <div id="banger" class="window"  :style="{'--delay': 3}">
          <h3 v-if="artistDone" class="nomargin window-title">Audio Analysis</h3>  
          <div v-if="audioAnalysisReady" class="graph" :style="{'--numBars': + trackData.audioAnalysis.length}">
              <div class="graph-bar" v-for="(bar, index) in trackData.audioAnalysis" :style="{'--height': + bar.loudness_max, '--red': + bar.red, '--green': + bar.green, '--blue': + bar.blue,}" :key="'audio-analysis'+index">
                  <p>{{time(bar.start)}}</p>
              </div>
          </div>
          <div v-if="audioAnalysisReady" class="graph-key flex flex-space-between"><p>Height: Volume</p><p>Color: Pitch</p></div>
          <Loading v-else/>
        </div>

        <div id="banger" class="window" :style="{'--delay': 5}">
          <h3 class="window-title" v-if="artistDone">Is This a Banger?</h3>  
          <div v-if="audioFeaturesDone">
            <PercentBar title="Banger-Level" :percent="trackData.banger" :color="audioFeatures.banger.color" />
            <h3 id="banger-conclusion">{{bangerConclusion()}}</h3>
          </div>
          <Loading v-else/>
        </div>

        <div class="window" :style="{'--delay': + 4}">
          <h3  class="window-title" v-if="artistDone">Compaired to Liked (Percentile):</h3>
          <div v-if="percentilesReady">
            <PercentileBar title="Happiness" :percent="trackData.percentiles.valence" :color="audioFeatures.valence.color" />
            <PercentileBar title="Energy" :percent="trackData.percentiles.energy" :color="audioFeatures.energy.color" />
            <PercentileBar title="Danceability" :percent="trackData.percentiles.danceability" :color="audioFeatures.danceability.color" />
            <PercentileBar title="Banger-Level" :percent="trackData.percentiles.banger" :color="audioFeatures.banger.color" />
          </div>
          <Loading v-else/>
        </div>

        <Spotlight :delay="6" :numOff="true" :override="artistDone" title="Genres:" :list="genresComputed" image=""/>

        <div class="window" :style="{'--delay': + 7}">
          <h3  class="window-title" v-if="artistDone">Song Statistics:</h3>
          <div v-if="audioFeaturesDone">

            <div class="flex flex-space-between">
              <h4>Key</h4>
              <div class="flex flex-space-around" id="keys" :style="{'--red': + 242, '--green': + 142, '--blue': + 43}">
                <h4 class="key" v-for="(key, index) in keys" :key="'keys' + key" :style="{'--index': + index}" :class="{activeKey: key == getKey(trackData.key)}">{{key}}</h4>
              </div>
            </div>

            <div class="flex flex-space-between">
              <h4>Mode</h4>
              <div id="modes" class="flex">
                  <h4 class="mode" :class="{activemode: mode(trackData.mode) == 'Major'}">Major</h4>
                  <h4 class="mode" :class="{activemode: mode(trackData.mode) == 'Minor'}">Minor</h4>
              </div>
            </div>

            <div class="flex flex-space-between">
              <h4>Tempo</h4>
              <h4>{{getTempo()}}</h4>
            </div>


            <div class="flex flex-space-between">
              <h4>Duration</h4>
              <h4>{{time(Math.round(trackData.duration_ms / 1000))}}</h4>
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
import Spotlight from '@/components/Library/Spotlight.vue'
import PercentBar from '@/components/Analysis/PercentBar.vue'
import PercentileBar from '@/components/Analysis/PercentileBar.vue'

export default {
    name: 'songanalysis',
    components: {
        NavBar,
        GoBackSearch,
        Loading,
        PercentBar,
        PercentileBar,
        Spotlight
    },
    data() {
        return {
          trackData: null,
          artistDone: false,
          audioFeaturesDone: false,
          audioAnalysisReady: false,
          percentilesReady: false,
          interval: null,
          keys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        }
    },
    methods: {
      async checkTracksLoaded() {
        if (this.progress.tracksLoaded) {
          clearInterval(this.interval);
          this.trackData.percentiles = await this.$store.dispatch('getPercentiles', {
            valence: this.trackData.valence, 
            energy: this.trackData.energy, 
            danceability: this.trackData.danceability, 
            banger: this.trackData.banger, 
          });
          this.percentilesReady = true;
        }
      },
      getTempo() {
        return Math.round(this.trackData.tempo) + " BPM";
      },
      time(seconds) {
          let zero = "";
          if (seconds % 60 < 10)
          {
              zero = "0";
          }
          if (seconds < 60)
          {
              return "0:" + zero + seconds;
          }
          return Math.floor(seconds / 60) + ":" + zero + (seconds % 60);
      },
      mode(val) {
          if (val)
              return "Major";
          return "Minor";
      
      },
      getKey(val) {
          if (val == -1)
              return "Not Found";
          return this.keys[val % 12];
      },
      bangerConclusion() {
        if (this.audioFeaturesDone) {
          let results = ["Banger? More like Bummer", "Nah Bruh", "Not Banger.", "Cool, but not Banger", "Like Sorta Banger?", "Got A Semi-Banger", "Almost Banger", "What a Banger!", "Absolute Banger Bro", "Banger of all Bangers"];
          if (Math.floor(this.trackData.banger * 10) < results.length)
              return results[Math.floor(this.trackData.banger * 10)];
          return "Banger of all Bangers";
        }
        return "";
      },
      async getArtistDetails() {
        this.trackData.artist = await this.$store.dispatch('getArtist', this.trackData.artists[0].id);
        this.artistDone = true;
      },
      formatNumber(num) {
        let millions = Math.floor(num / 1000000);
        let thousands = Math.floor(num / 1000)  % 1000;
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
      goToArtist() {
        this.$router.push('/artists/' + this.trackData.artists[0].id);
      }
    },
    computed: {
      inicialized() {
        return this.$store.state.inicialized;
      },
      genresComputed() {
        if (this.artistDone)
          return this.trackData.artist.genres.slice(0, 4);
        return [];
      },
      songsSaved() {
        if (this.trackData.artists[0].id in this.$store.state.artists) {
          return this.$store.state.artists[this.trackData.artists[0].id].tracks.length + " Songs Liked";
        }
        return "No Songs Liked";
      },
      progress() {
        return this.$store.state.progress;
      },
      audioFeatures() {
        return this.$store.state.audioFeatures
      }
    },  
    async created() {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      if (!this.inicialized)
        this.$router.push("/login");

      this.trackData = await this.$store.dispatch('songAnalysis', this.$route.params.id);
      this.trackData.banger = await this.$store.dispatch('bangerCalc', {tempo: this.trackData.tempo, danceability: this.trackData.danceability, energy: this.trackData.energy});
      this.audioFeaturesDone = true;
      this.audioAnalysisReady = true;
      await this.getArtistDetails();
      if (this.progress.tracksLoaded) {
        this.trackData.percentiles = await this.$store.dispatch('getPercentiles', {
          valence: this.trackData.valence, 
          energy: this.trackData.energy, 
          danceability: this.trackData.danceability, 
          banger: this.trackData.banger, 
        });
        this.percentilesReady = true;
      }
      else {
        this.interval = setInterval(this.checkTracksLoaded, 2000);
      }
    }
}

</script>

<style scoped>
.windows {
  display: flex;
  width: 100%;
  max-width: 1400px !important;
  justify-content: top !important;
  align-items: top;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-bottom: 50px;
  margin-top: 30px;
}


.mode {
  display: inline-block;
  color: rgba(255, 255, 255, 0.13);
  margin-left: 8px;
}

#modes {
  display: flex;
  justify-content: flex-end;
}

.activemode {
  color: white;
}

@media screen and (max-width: 720px) {

  .key {
    font-size: .8em !important;
  }
  .windows {
    margin-top: 15px;
  }

  #track-image {
    width: 70px !important;
    height: 70px !important;
    margin-right: 20px;
  }

  h1 {
    font-size: 1.2em !important;
    
  }

  h2 {
      font-size: .8em !important;
      margin: 2px !important;
  }

  h4 {
    font-size: .9em !important;
  }

  .col.fit #artists h3 {
    margin: 0 !important;
    margin-top: 0px !important;
  }

  .window {
      margin: 18px 18px !important;
  }

  #banger-conclusion {
    font-size: 2em !important;
  }

  .graph {
    height: 150px !important;
  }
}

#banger-conclusion {
    margin: 0 auto;
    text-align: center;
    color: rgb(252, 140, 142);
    font-size: 3em;
}

.fit {
  display: block;
  width: calc(100% - 120px) !important;
}

.window {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 25px 25px;
    padding: 25px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
    position: relative;
}



.row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

#track-image {
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

#artists {
    display: flex;
    max-width: calc(100% - 5px);
    overflow: hidden;
}

#artists h3 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.927);
    text-align: left;
    margin: 0px 0px;
    margin-right: 5px;
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 10px;
}

#keys {
  --red: 0;
  --green: 0;
  --blue: 0;
  display: flex;

  width: calc(100% - 102px);
}

.key {
  --index: 0;
  color:rgba(255, 255, 255, 0.205);
  font-size: 1em;
  font-weight: lighter;
  animation: bump 2s ease-in-out calc(var(--index) * .2s) infinite;
}

@keyframes bump {
  0% {
    opacity: .8;
  }
  50% {
    opacity: .8;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: .8;
  }
}

.key.activeKey {
  color: rgb(255, 255, 255);
  font-size: 1em !important;
  font-weight: bolder;
  animation: none;
}


h4 {
  --red: 255;
  --green: 255;
  --blue: 255;
  color: rgba(var(--red), var(--green), var(--blue), 1);
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
  font-size: 16px;
  margin: 8px 0;
}

p {
    margin: 0;
    color: white;
    text-align: left;
}

.flex {
    display: flex;
    width: 100%;
    align-items: center;
}

#artists {
    display: flex;
    max-width: calc(100% - 5px);
    overflow: hidden;
}



#characteristics {
  margin-top: 30px;
}

.nomargin {
    margin: 0 !important;
}

#artist-name {
  cursor: pointer;
}

#artist-name:hover {
  text-decoration: underline;
}

.col.fit #artists h3 {
  margin: 0;
  margin-top: 8px;
}

.graph {
    --numBars: 0;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 400px;
    height: 187px;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    margin: 10px 0px;
}

.graph-bar {
    --height: 0;
    --red: 240;
    --green: 193;
    --blue: 111;
    display: block;
    width: calc((100% / var(--numBars)) - 1px);
    height: calc(125px * var(--height));
    background-color: rgba(var(--red), var(--green), var(--blue), .9);
    border-radius: 3px;
    position: relative;
    animation: bar-graph-slide .5s ease-out calc(var(--height) * 1s), hide calc(var(--height) * 1s);
}


@keyframes bar-graph-slide {
  from {
    height: calc(0px * var(--height));
  }
}

.graph-bar p {
    display: none;
    position: absolute;
    font-size: 1em;
    color: white;
    text-align: center;
    top: calc(((125px * var(--height)) / 2) + -90px);
    transform: translateX(-15px);
}

.graph-bar:hover p {
    display: block;
}


.graph-key {
    position: absolute;
    width: calc(100% - 80px);
    left: 40px;
    bottom: 10px;
    text-align: center;
    font-size: .8em;
    color:rgba(255, 255, 255, 0.267);
}

.graph-key p {
  color: rgba(255, 255, 255, 0.329);
}
</style>