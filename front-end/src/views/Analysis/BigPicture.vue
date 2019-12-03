<template>
  <div class="bigpicture">
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
      <v-tab-item :value="0">
        <Overview/>
      </v-tab-item>
      <v-tab-item :value="1">
        <Traits/>
      </v-tab-item>
      <v-tab-item :value="2">
        <History/>
      </v-tab-item>
    </v-tabs>

    
  </div>
</template>

<script>
// @ is an alias to /src
import Overview from '@/components/BigPicture/Overview.vue'
import Traits from '@/components/BigPicture/Traits.vue'
import History from '@/components/BigPicture/History.vue'

export default {
  name: 'bigpicture',
  components: {
    Overview,
    Traits,
    History,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: "Overview"},
        {text: "Traits"},
        {text: "History"}
      ],
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
    },
    featureDistibution(title) {
      let width;
      if (window.innerWidth > 720) {
        width = (window.innerWidth - 260) / 2 - 60;
      }
      else {
        width = window.innerWidth * .9;
      }
      return {
        title: title,
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
  background: rgb(23, 37, 66) !important;
}

.theme--dark.v-tabs-items {
  width: 100%;
  background-color: rgb(23, 37, 66) !important;
  background: rgb(23, 37, 66) !important;
}
</style>