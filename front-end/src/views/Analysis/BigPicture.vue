<template>
  <div class="bigpicture">
    <div id="page-title">
      <div id="big-picture" class="page-title-icon"></div>
      <h1 id="page-title-text">Your Big Picture</h1>
    </div>

    <div class="windows" v-if="progress.total == progress.processed">
      <div class="window">
        <h1>Your Library:</h1>
        <div class="flex flex-space-between">
          <h2>Tracks:</h2>
          <h2 class="active">{{formatNumber(Object.keys(tracks).length)}}</h2>
        </div>
        <div class="flex flex-space-between">
          <h2>Artists:</h2>
          <h2 class="active">{{formatNumber(Object.keys(artists).length)}}</h2>
        </div>
        <div class="flex flex-space-between">
          <h2>Genres:</h2>
          <h2 class="active">{{formatNumber(Object.keys(genres).length)}}</h2>
        </div>
      </div>

      <div class="window">
        <h1>Characteristics:</h1>
        <BarValue type="happiness" :value="audioFeatures.valence.value" maxLabel="Happy" minLabel="Sad" :color="audioFeatures.valence.color"/>
        <BarValue type="energy" :value="audioFeatures.energy.value" maxLabel="Hyper" minLabel="Relaxed" :color="audioFeatures.energy.color"/>
        <BarValue type="danceability" :value="audioFeatures.danceability.value" maxLabel="Danceable" minLabel="Couch Potato" :color="audioFeatures.danceability.color"/>
      </div>

      <div class="window">
        <h1>Averages:</h1>
        <BarValue type="tempo" :value="audioFeatures.tempo.value" maxLabel="Fast" minLabel="Slow" :color="audioFeatures.tempo.color"/>
        <BarValue type="major" :value="mode.value" maxLabel="Major" minLabel="Minor" :color="mode.major"/>
        <BarValue type="volume" :value="audioFeatures.loudness.value" maxLabel="Loud" minLabel="Quiet" :color="audioFeatures.loudness.color"/>
      </div>


    </div>

    
  </div>
</template>

<script>
// @ is an alias to /src
import BarValue from '@/components/Analysis/BarValue.vue'


export default {
  name: 'bigpicture',
  components: {
    BarValue
  },
  data() {
    return {

    }
  },
  methods: {
    formatNumber(num) {
      let segments = [];
      while (num >= 1000) {
        let remainder = num % 1000;
        segments.push(remainder);
        num = Math.floor(num / 1000);
      }
      segments.push(num);
      let string = "";
      for (let i = segments.length - 1; i >= 0; i--) {
        if (segments[i] < 100 && i != segments.length - 1) 
          string += "0";
        if (segments[i] < 10 && i != segments.length - 1) 
          string += "0";
        string += segments[i];
        if (i != 0)
          string += ",";
      }
      return string;
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

.window div h2 {
  color: rgba(161, 161, 161, 0.644);
  font-size: 1em;
  padding-bottom: 6px;
}

.window div h2.active {
  color: rgba(255, 255, 255, 0.925);
}

</style>