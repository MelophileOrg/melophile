<template>
  <div id="main-flex" class="mylibrary">
    <NavBar />
    <div id="main">
      <div v-if="progress.tracksLoaded" id="menu">
        <h1>Your Library Analysis</h1>
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

        <YourLibrary :delay="0"/>

        <Characteristics :delay="1"/>

        <Spotlight :delay="2" :override="progress.artistsLoaded" title="Most Saved Artists:" :list="topSavedArtists" :image="topSavedArtists[0].image"/>

        <Spotlight :delay="3" :override="progress.genresLoaded" title="Most Saved Genres:" :list="topSavedGenres.slice(0, 4)" image=""/>

        <Averages :delay="4"/>

        <Chances :delay="5"/>

        <Timeline :override="progress.tracksLoaded" title="When You Added Songs:" instructions="" :max="-1" :delay="6" :bars="cleanGraphData(dateAdded)" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        
        <TimelinePercent :override="progress.tracksLoaded" title="Happiness Over Time:" instructions="" :delay="7" :bars="cleanValuedGraphData(audioFeatures.valence.timeline)" :max="100" y_axis="Percent Happiness" />

        <Graph :override="progress.tracksLoaded" title="Happiness Distribution:" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="8" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph :override="progress.tracksLoaded" title="Energy Distribution:" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="9" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph :override="progress.tracksLoaded" title="Danceability Distribution:" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="10" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>

        <Graph :override="progress.tracksLoaded" title="Should You DJ a Party?" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="11" :bars="cleanGraphData(audioFeatures.banger.plot)" max_tag="Absolute Bangers" min_tag="*Snore*" y_axis="Number of Songs" :color="audioFeatures.banger.color"/>
      </div>

      <div v-if="progress.tracksLoaded && tab == 1">
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
      this.tab = number;
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
  }
}
</script>

<style scoped>
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
}

.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

h1 {
    color: #fff;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
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
  animation: slide-up .3s ease .1s, hide .1s linear;
}

h2.active {
  color: white;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 22px 22px;
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


</style>