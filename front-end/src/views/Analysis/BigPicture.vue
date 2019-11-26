<template>
  <div class="bigpicture">
    <PageTitle title="Your Big Picture" description="Overall Library statistics."/>
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
      <v-tab-item :value="0">
        <h1>Overview</h1>
      </v-tab-item>
      <v-tab-item :value="1">
        <h1>Traits</h1>
        <FeatureGraph :graph_data="featureDistibution('Happiness Distribution', 'valence', audioFeatures.valence.plot)"/>
      </v-tab-item>
      <v-tab-item :value="2">
        <h1>Timeline</h1>
      </v-tab-item>
    </v-tabs>

    
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from '@/components/General/PageTitle.vue'
import FeatureGraph from '@/components/LineGraphs/FeatureGraph.vue'

export default {
  name: 'bigpicture',
  components: {
    PageTitle,
    FeatureGraph,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: "Overview"},
        {text: "Traits"},
        {text: "Timeline"}
      ],
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
    },
    featureDistibution(title, feature, bars) {
      let width;
      if (window.innerWidth > 720) {
        width = (window.innerWidth - 260) / 2 - 60;
      }
      else {
        width = window.innerWidth * .9;
      }
      return {
        title: title,
        feature: feature,
        bars: bars,
        width: width,
        height: 225,
      }
    },
  },
  computed: {
    progress() {
      return this.$store.state.progress;
    },
    tracks() {
      return this.$store.state.tracks;
    },
    genres() {
      return this.$store.state.genres;
    },
    artists() {
      return this.$store.state.artists;
    },
    topPlayed() {
      return this.$store.state.topPlayed;
    },
    topSaved() {
      return this.$store.state.topSaved;
    },
    audioFeatures() {
      return this.$store.state.audioFeatures;
    },
    mode() {
      return this.$store.state.mode;
    },
    dateAdded() {
      return this.$store.state.dateAdded;
    },
  },
  created() {
  },
}
</script>

<style scoped>
div.v-tab {
  justify-content: center;
}

div.v-card.theme--dark {
  background: rgb(0,0,0,0) !important;
}

.theme--dark.v-tabs-items {
  background-color: rgb(0,0,0,0) !important;
  background: rgb(0,0,0,0) !important;
}
</style>