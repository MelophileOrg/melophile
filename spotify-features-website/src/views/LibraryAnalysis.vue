<template>
  <div class="libraryanalysis">
    <NavBar path="libraryanalysis" />
    <div id="main">
      <AppTitle v-if="!done" title="Library Analysis" image="library"/>
      <button v-if="!done && progress == 0" @click="startRetrievalProcess">Start</button>
      <div v-if="!done && progress != 0" id="progress-bar">
        <div :style="{'--total': + total, '--progress': + progress}" id="progress-fill"/>
      </div>
      <h3 v-if="!done && progress != 0">{{message}}</h3>
      <div v-if="done" id="results">
        
        <div id="menu">
          <h1>Your Library Analysis</h1>
          <div id="tabs">
            <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
            <h2 @click="changeTab(1)" :class="{active: tab == 1}">Extremes</h2>
          </div>
        </div>
        <div id="audio-features" v-if="tab == 0">
          <div id="characteristics" class="window" :style="{'--delay': 0}">
            <h3>Characteristics</h3>
            <div class="row stat">
              <h4>Happiness</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.valence.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.valence.value)}}</h4>
            </div>
            <div class="row stat">
              <h4>Energy</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.energy.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.energy.value)}}</h4>
            </div>
            <div class="row stat">
              <h4>Danceability</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.danceability.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.danceability.value)}}</h4>
            </div>
          </div>

          <div id="averages" class="window" :style="{'--delay': 1}">
            <h3>Averages</h3>
            <div class="row stat">
              <h4>Tempo</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + tempoPercent}"/>
              </div>
              <h4 class="value">{{percent(tempoPercent)}}</h4>
            </div>
            <div class="row stat">
              <h4>Minor/Major</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.mode.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.mode.value)}}</h4>
            </div>
          </div>

          <div id="chances" class="window"  :style="{'--delay': 2}">
            <h3>Chance a Song in Your Library...</h3>
            <div class="row stat">
              <h4>is Accoustic</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.acousticness.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.acousticness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4>is Instrumental</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.instrumentalness.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.instrumentalness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4>is Live</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.liveness.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.liveness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4>has Words</h4>
              <div class="bar">
                <div class="fill" :style="{'--percent': + audio_features.speechiness.value}"/>
              </div>
              <h4 class="value">{{percent(audio_features.speechiness.value)}}</h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AppTitle from '@/components/AppTitle.vue'

export default {
  name: 'libraryanalysis',
  components: {
    NavBar,
    AppTitle,
  },
  data() {
    return {
      genre: {},
      audio_features: {
        acousticness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        danceability: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        energy: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        instrumentalness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        liveness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        mode: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        speechiness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        tempo: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
        total: 0,
        valence: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
        },
      },
      total: 0,
      progress: 0,
      done: false,
      message: "Pluggin in headphones.",
      tab: 0,
      list: [],
      animateIndex: 0,
      interval: null,
    }
  },
  methods: {
    percent(value) {
      return Math.round(value * 100) + "%";
    },
    changeTab(val) {
      this.tab = val;
    },
    startRetrievalProcess() {
      this.retriveData(0, 50, true);
    },
    async retriveData(offset, limit, first) {
      if (this.$router.currentRoute.name != "libraryanalysis")
      {
        return;
      }
      let response = await this.$store.dispatch('getSavedTracks',{limit: limit, offset: offset});
      // get genre
      this.total = response.total;
      this.progress = offset;
      if (this.progress / this.total > .8)
        this.message = "Let me sort this out.";
      else if (this.progress / this.total > .6)
        this.message = "Sick beats dude.";
      else if (this.progress / this.total > .4)
        this.message = "Jamming out to your tunes.";
      else if (this.progress / this.total > .2)
        this.message = "Looking through your libary.";
      let ids = [];
      for (var i = 0; i < response.items.length; i++)
      {
        ids.push(response.items[i].track.id);
      }
      let tracks = await this.$store.dispatch('getAudioFeaturesForTracks',ids);
      this.analyseData(tracks);
      if (response.items.length == 50)
      {
        this.retriveData(offset + limit, limit, false);
      }
      else {
        let keys = Object.keys(this.audio_features);
        for (var i = 0; i < keys.length; i++)
        {
          if (keys[i] == "total")
            continue;
          this.audio_features[keys[i]].value /= this.audio_features.total;
        }
        this.done = true;
        console.log(this.audio_features);
      }
    },
    analyseData(tracks) {
      let keys = Object.keys(this.audio_features); 
      for (var i = 0; i < tracks.length; i++)
      {
        for (var j = 0; j < keys.length; j++)
        {
          if (keys[j] == "total")
          {
            this.audio_features.total += 1;
            continue;
          }
          this.audio_features[keys[j]].value += tracks[i][keys[j]];
          for (var k = 0; k < this.audio_features[keys[j]].minchart.length; k++)
          {
            if (this.audio_features[keys[j]].minchart[k].value > tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].minchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].minchart.length > 20)
              {
                this.audio_features[keys[j]].minchart.splice(20, 1);
              }
              break;
            }
            if (k == this.audio_features[keys[j]].minchart.length - 1 && this.audio_features[keys[j]].minchart.length < 20)
            {
              this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].minchart.length == 0)
          {
            this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
          }
          for (var k = 0; k < this.audio_features[keys[j]].maxchart.length; k++)
          {
            if (this.audio_features[keys[j]].maxchart[k].value < tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].maxchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].maxchart.length > 20)
              {
                this.audio_features[keys[j]].maxchart.splice(20, 1);
              }
              break;
            }
            if (k == this.audio_features[keys[j]].maxchart.length - 1 && this.audio_features[keys[j]].maxchart.length < 20)
            {
              this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].maxchart.length == 0)
          {
            this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
          }

        }
      }
    },
    animate() {
      if (this.animateIndex >= 1)
      {
        this.animateIndex = 1;
        clearInterval(this.interval);
      }
      else {
        this.animateIndex += .1;
      }
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    tempoPercent() {
      if (this.done)
      {
        let min = this.audio_features.tempo.minchart[0].value;
        let max = this.audio_features.tempo.maxchart[0].value;
        let diff = max - min;
        return (this.audio_features.tempo.value - min) / diff;
      }
      return 0;
    }
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
    this.interval = setInterval(this.animate, 100);
  }
}
</script>

<style scoped>

#audio-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 75px;
  padding: 32px;
  padding-top: 0px;
}
#menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 32px;
}

#tabs {
  display: flex;
  justify-content: center;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s);
  display: block;
  width: 75%;
  margin: 20px 20px;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}

h1 {
  color: white;
  animation: slide-up .3s ease 0s, peekaboo 0s linear;
}

h2 {
  color: rgba(255, 255, 255, 0.452);
  margin: 10px 20px;
  cursor: pointer;
  transition: all .3s ease;
  animation: slide-up .3s ease .1s, peekaboo .1s linear;
}

.row {
  display: flex;
  align-items: center;
}
h2:hover {
  color: rgba(255, 255, 255, 0.87);
}

h2.active {
  color: white;
}


.libraryanalysis {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

button {
  padding: 10px 50px;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.137);
  border-radius: 5px;
  color: rgb(255, 255, 255);
  border: 0px;
  font-weight: bolder;
  font-size: 1.2em;
  animation: slide-up .3s ease .3s, peekaboo .3s linear;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

h3 {
  margin: 5px;
  color: white;
  animation: throb 2s ease 0s infinite;
}

@keyframes throb {
  0% {
    color: white;
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
  50% {
    color: rgb(167, 167, 167);
    text-shadow: 0px 0px 0px rgba(255, 255, 255, 0.482);
  }
  100% {
     text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
}
#progress-bar {
  display: block;
  width: 40%;
  height: 8px;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(250, 250, 250, 0.173);
  margin: 0 auto;
  margin-top: 10px;
}

#progress-fill {
  --total: 0;
  --progress: 0;
  display: block;
  background: rgb(244, 244, 244);
  width: calc(var(--progress) / var(--total) * 100%);
  height: 100%;
}

h4 {
  color: white;
  margin: 5px 10px;
  width: 115px;
  text-align: left;
}

.bar {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    width: 200px;
    max-height: 10px;
    background-color: rgba(255, 255, 255, 0.247);
}

.bar .fill {
    --percent: 0;
    display: block;
    width: calc(var(--percent) * 100%);
    height: 10px;
    background: white;
    animation: slow-fill 1s ease;
}

@keyframes slow-fill {
  from {
    width: calc(var(--percent) * 0%);
  }
}

.window h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin-bottom: 10px;
}

.stat {
  margin-bottom: 5px;
}

.value {
  width: 40px;
  text-align: right;
}
</style>