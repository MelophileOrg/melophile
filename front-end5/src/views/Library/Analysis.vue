<template>
  <div id="main-flex" class="analysis">
    <NavBar />
    <div id="main">
      <PageTitle title="Your Big Picture" description="An indepth analysis of your library." :button="{text: 'Share', path: '/social/save'}" />
      <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
        <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
      </v-tabs>


        <FeatureGraph :graph_data="featureDistibution('Happiness Distribution', 'valence', audioFeatures.valence.plot)"/>
        <!-- <Graph :override="progress.tracks" title="Happiness Distribution:" instructions="View Lists" :delay="8" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/> -->

          <FeatureGraph :graph_data="featureDistibution('Energy Distribution', 'energy', audioFeatures.energy.plot)"/>
        <!-- <Graph :override="progress.tracks" title="Energy Distribution:" instructions="View Lists" :delay="9" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/> -->

          <FeatureGraph :graph_data="featureDistibution('Danceability Distribution', 'danceability', audioFeatures.danceability.plot)"/>
        <!-- <Graph :override="progress.tracks" title="Danceability Distribution:" instructions="View Lists" :delay="10" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/> -->

          <FeatureGraph :graph_data="featureDistibution('Bangerability Distribution', 'banger', audioFeatures.banger.plot)"/>
        <!-- <Graph :override="progress.tracks" title="Should You DJ a Party?" instructions="View Lists" :delay="11" :bars="cleanGraphData(audioFeatures.banger.plot)" max_tag="Absolute Bangers" min_tag="*Snore Snore*" y_axis="Number of Songs" :color="audioFeatures.banger.color"/> -->

      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import PageTitle from '@/components/Menu/PageTitle.vue'
import Progress from '@/components/General/Progress.vue'
import FeatureGraph from '@/components/Graphs/FeatureGraph.vue'

export default {
  name: 'analysis',
  components: {
    NavBar,
    PageTitle,
    Progress,
    FeatureGraph
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: ""},
        {text: "Top Saved"},
        {text: "Extremes"},
      ],
    }
  },
  methods: {
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
      if (!this.progress.tracks)
        return;
      return this.$store.state.artists;
    },
    genres() {
      if (!this.progress.tracks)
        return;
      return this.$store.state.genres;
    },
    audioFeatures() {
      if (!this.progress.tracks)
        return;
      return this.$store.state.audioFeatures;
    },
    dateAdded() {
      if (!this.progress.tracks)
        return;
      return this.$store.state.dateAdded;
    },
    topSavedArtists() {
      if (!this.progress.artists)
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
      if (!this.progress.genres)
        return;
      let ids = this.$store.state.topSaved.genres;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        let genre = this.$store.state.genres[ids[i]];
        genre.value = genre.trackNum;
        list.push(genre);
      }
      return list;
    }
  },
  created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>

<style scoped>



</style>