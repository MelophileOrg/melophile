<template>
  <div id="main-flex" class="mylibrary">
    <NavBar/>
    <div id="main">
      <div id="menu">
        <h1>Your Library Analysis</h1>
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
          <h2 @click="changeTab(1)" :class="{active: tab == 1}">Extremes</h2>
        </div>
      </div>
      <div class="windows">
        <div v-if="tab == 0" id="library-details" class="window" :style="{'--delay': + 0}">
          <h3>Your Library</h3>
          <div class="row">
            <h4 class="light"><h4>{{total}}</h4>Saved Songs</h4>
          </div>
          <div class="row">
            <h4 class="light"><h4>{{Object.keys(artists).length}}</h4>Artists</h4>
          </div>
          <div v-if="genresDone" class="row">
            <h4 class="light"><h4>{{Object.keys(genres).length}}</h4>Genres</h4>
          </div>
        </div>
        <Timeline title="When You Added Songs" instructions="" :delay="0" :bars="cleanGraphData(dateAdded)" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        <Graph title="Happiness Distribution" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="0" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>
        <Graph title="Energy Distribution" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="0" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>
        <Graph title="Danceability Distribution" instructions="Go to the Extremes Tab for the Highest and Lowest Tracks" :delay="0" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Graph from '@/components/Analysis/Graph.vue'
import Timeline from '@/components/Analysis/Timeline.vue'

export default {
  name: 'mylibrary',
  components: {
    NavBar,
    Graph,
    Timeline,
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
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    total() {
      return this.$store.state.progress.total;
    },
    artists() {
      return this.$store.state.artists;
    },
    genres() {
      return this.$store.state.genres;
    },
    audioFeatures() {
      return this.$store.state.audioFeatures;
    },
    dateAdded() {
      let normal = this.$store.state.dateAdded;
      let reversed = [];
      for (var i = normal.length - 1; i >= 0; i--) {
        reversed.push(normal[i]);
      }
      return reversed;
    },
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>
#menu {
  padding: 10px 32px;
}

.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
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
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 20px 20px;
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
}
</style>