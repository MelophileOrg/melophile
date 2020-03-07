<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <button @click="randomize">Randomize</button>
      <div class="flex flex-space-around">
        <div class="graph">
          <FeatureGraph :graph_data="graph"/>
        </div>
      </div>
      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/Navigation/NavBar.vue'
import Progress from '@/components/General/Progress.vue'
import FeatureGraph from '@/components/Graphs/FeatureGraph.vue'

import axios from 'axios';

export default {
  name: 'home',
  components: {
    NavBar,
    Progress,
    FeatureGraph
  },
  data() {
    return {
      graph: null,
    }
  },
  methods: {
    makeGraphs() {
      let features = ['acousticness', 'danceability', 'energy', 'instrumentalness','liveness', 'loudness', 'speechiness', 'valence', 'tempo', 'banger'];
      let index = Math.floor(Math.random() * features.length);
      this.graph = {
        
        title: features[index],
        feature: features[index],
        bars: this.randomBars(),
        width: 500,
        height: 300,
      };
      console.log(this.graph);
    },
    randomize() {
      let features = ['acousticness', 'danceability', 'energy', 'instrumentalness','liveness', 'loudness', 'speechiness', 'valence', 'tempo', 'banger'];
      this.graph.feature = features[Math.floor(Math.random() * features.length)];
      this.graph.bars = this.randomBars();
  
      console.log(this.graph);
    },
    randomBars() {
      let bars = [];
      for (let i = 0; i < 11; i++) {
        bars.push(Math.round(Math.random() * 20));
      }
      return bars;
    },
    login() {
      this.$router.push('/login');
    },
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    }
  },
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    this.makeGraphs();
    let response = await axios.get('/api/');
    console.log(response);
  }
}
</script>

<style scoped>
.graph {
  display: block;
  width: 450px;
  height: 250px;
  padding: 20px;
  margin-top: 50px;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 20px;
}

.flex {
  max-width: 100%;
  flex-wrap: wrap;
}

button {
  position: fixed;
  top: 30px;
  left: 45vw;
  z-index: 100;
}
</style>
