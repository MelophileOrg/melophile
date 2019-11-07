<template>
  <div id="main-flex" class="mylibrary">
    <NavBar />
    <div id="main">
      <div v-if="progress.tracksLoaded" id="menu">
        <div id="title">
          <h1>Your Library Analysis</h1>
          <button @click="save">Share</button>
        </div>
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
          <h2 @click="changeTab(1)" :class="{active: tab == 1}">Extremes</h2>
        </div>
      </div>

      <div class="progress" v-if="!progress.tracksLoaded" >
        <div class="progress-info" >
          <ProgressBar/>
        </div>
      </div>
      
      <div v-if="progress.tracksLoaded && tab == 0" class="windows">

        <YourLibrary title="Your Library" :delay="0"/>

        <Characteristics :delay="1"/>

        <Spotlight :delay="2" :override="progress.artistsLoaded" title="Most Saved Artists:" :list="topSavedArtists" :image="topSavedArtists[0].image"/>

        <Spotlight :delay="3" :override="progress.genresLoaded" title="Most Saved Genres:" :list="topSavedGenres.slice(0, 4)" image=""/>

        <Averages :delay="4"/>

        <Chances :delay="5"/>

        <Timeline :override="progress.tracksLoaded" title="When You Added Songs:" instructions="" :max="-1" :delay="6" :bars="cleanGraphData(dateAdded)" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        
        <TimelinePercent :override="progress.tracksLoaded" title="Happiness Over Time:" instructions="" :delay="7" :bars="cleanValuedGraphData(audioFeatures.valence.timeline)" :max="100" y_axis="Percent Happiness" />

        <Graph @more="goToExtremes" :override="progress.tracksLoaded" title="Happiness Distribution:" instructions="View Charts" :delay="8" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph @more="goToExtremes" :override="progress.tracksLoaded" title="Energy Distribution:" instructions="View Charts" :delay="9" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph @more="goToExtremes" :override="progress.tracksLoaded" title="Danceability Distribution:" instructions="View Charts" :delay="10" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>

        <Graph @more="goToExtremes" :override="progress.tracksLoaded" title="Should You DJ a Party?" instructions="View Charts" :delay="11" :bars="cleanGraphData(audioFeatures.banger.plot)" max_tag="Absolute Bangers" min_tag="*Snore Snore*" y_axis="Number of Songs" :color="audioFeatures.banger.color"/>
      </div>

      <div class="extremes" v-if="progress.tracksLoaded && tab == 1">
        <Extremes/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Graph from '@/components/Analysis/Graph.vue'
import Timeline from '@/components/Analysis/Timeline.vue'
import TimelinePercent from '@/components/Analysis/TimelinePercent.vue'
import Spotlight from '@/components/Library/Spotlight.vue'
import YourLibrary from '@/components/Library/YourLibrary.vue'
import Characteristics from '@/components/Library/Characteristics.vue'
import Averages from '@/components/Library/Averages.vue'
import Chances from '@/components/Library/Chances.vue'
import Extremes from '@/components/Library/Extremes.vue'
import ProgressBar from '@/components/General/ProgressBar.vue'

export default {
  name: 'mylibrary',
  components: {
    NavBar,
    Graph,
    Timeline,
    Spotlight,
    YourLibrary,
    Characteristics,
    Averages,
    Chances,
    Extremes,
    TimelinePercent,
    ProgressBar,
  },
  data() {
    return {
      tab: 0,
    }
  },
  methods: {
    cleanGraphData(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    cleanValuedGraphData(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: Math.round(bars[i].value * 100), tag: Math.round(bars[i].value * 100) + "%"});
      }
      return graphData;
    },
    changeTab(number) {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.tab = number;

    },
    goToExtremes() {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.tab = 1;
    },
    save() {
      this.$router.push('/social/save');
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    total() {
      return this.$store.state.progress.total;
    },
    progress() {
      return this.$store.state.progress;
    },
    artists() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.artists;
    },
    genres() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.genres;
    },
    audioFeatures() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.audioFeatures;
    },
    dateAdded() {
      if (!this.progress.tracksLoaded)
        return;
      let normal = this.$store.state.dateAdded;
      let reversed = [];
      for (var i = normal.length - 1; i >= 0; i--) {
        reversed.push(normal[i]);
      }
      return reversed;
    },
    topSavedArtists() {
      if (!this.progress.artistsLoaded)
        return;
      let ids = this.$store.state.topSaved.artists;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        list.push(this.$store.state.artists[ids[i]]);
        list[i].value = list[i].tracks.length;
      }
      return list;
    },
    topSavedGenres() {
      if (!this.progress.genresLoaded)
        return;
      let ids = this.$store.state.topSaved.genres;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        let genre = this.$store.state.genres[ids[i]];
        genre.value = genre.tracknum;
        list.push(genre);
      }
      return list;
    }
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>

<style scoped>
#title {
  display: flex;
  justify-content: left;
  align-items: center;
}

#title h1 {
  display: inline-block;
}
#title button {
  border: 0px;
  color: rgba(255, 255, 255, 0.486);
  background-color: rgba(255, 255, 255, 0.103);
  font-size: 1.2em;
  height: 2em;
  border-radius: 20px;
  margin-left: 20px;
  padding: 5px 20px;
  transition: all .3s ease;
}
#title button:hover {
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.103);
}
.progress {
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgb(238, 126, 137);
  background-image: radial-gradient(circle at center center, rgb(137, 126, 238), rgb(238, 126, 137));
  background-size: 100% 300%;
  background-position: center -300%;
  animation: background-move 10s linear infinite;
}

@keyframes background-move {
  0% {
    background-position: center -300%;
  }
  100% {
    background-position: center 0%;
  }
}

.progress-info {
  padding-top: 12vh;
}

#menu {
  width: calc(100% - 64px);
  padding: 10px 32px;
  animation: slide-up .3s ease .1s, hide .1s linear;
}

.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

h1 {
    color: #fff;
    position: relative;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
}

@media screen and (max-width: 720px) {
  #title {
    display: none;
  }

  h2 {
    font-size: 1.2em;
  }

  #menu {
    padding: 10px 0;
    width: 100vw;
    margin-bottom: 10px;
    background-color: rgba(255, 251, 251, 0.048);
  }

}

#tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 100vw;
  flex-wrap: wrap;
}

h2 {
  color: rgba(255, 255, 255, 0.452);
  margin: 10px 20px;
  cursor: pointer;
  transition: all .3s ease;
  
}

h2.active {
  color: white;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 30px 30px !important;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}

h3 {
  margin: 5px;
  margin-top: 10px;
  color: white;
  animation: throb 2s ease 0s infinite;
}

.row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

h5 {
  color: rgba(255, 255, 255, 0.514);
  margin: 0;
  text-align: left;
  font-size: .8em;
}

.light {
  color: rgba(255, 255, 255, 0.514) !important;
  font-size: 1.4em;
  margin-bottom: 2px;
}

.extremes {
  margin-top: 20px;
}

.num {
  margin-right: 5px;
  font-size: 1.8em;
}

h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}

.windows {
  margin-top: 0px;
}

</style>