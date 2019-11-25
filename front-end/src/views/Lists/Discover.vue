<template>
  <div class="discover">
    <v-stepper v-model="step" :dark="true">
      <div id="header">
        <h1 class="title">Discover</h1>
        <v-stepper-header>
          <v-stepper-step color="rgba(206, 206, 206, 0.603)" :complete="step > 1" step="1">Select a Song</v-stepper-step>
    
          <v-divider></v-divider>
    
          <v-stepper-step color="rgba(206, 206, 206, 0.603)" :complete="step > 2" step="2">Choose Settings</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step color="rgba(206, 206, 206, 0.603)" :complete="step > 3" step="3">Find New Music!</v-stepper-step>

        </v-stepper-header>
      </div>
  
      <v-stepper-items>
        <v-stepper-content step="1">
          <div id="search-bar">
            <v-text-field @change="search" label="Search for a Track" outlined prepend-inner-icon="fa-search"></v-text-field>
          </div>
          <div class="padding"></div>
          <v-btn text>Reset</v-btn>
        </v-stepper-content>
  
        <v-stepper-content step="2">
          <div id="search-bar">
            <v-range-slider v-model="options.valence" :min="featureRange.min" :max="featureRange.max" hide-details class="align-center" thumb-label label="Happiness" dark :color="'rgb(' + audioFeatures.valence.color.red + ',' + audioFeatures.valence.color.green + ',' + audioFeatures.valence.color.blue + ')'"/>
            <v-range-slider v-model="options.energy" :min="featureRange.min" :max="featureRange.max" hide-details class="align-center" thumb-label label="Energy" dark :color="'rgb(' + audioFeatures.energy.color.red + ',' + audioFeatures.energy.color.green + ',' + audioFeatures.energy.color.blue + ')'"/>
            <v-range-slider v-model="options.danceability" :min="featureRange.min" :max="featureRange.max" hide-details class="align-center" thumb-label label="Danceability" dark :color="'rgb(' + audioFeatures.danceability.color.red + ',' + audioFeatures.danceability.color.green + ',' + audioFeatures.danceability.color.blue + ')'"/>
          </div>
          <v-btn color="green" @click="step = 3">Continue</v-btn>
          <v-btn text>Reset</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>



    
  </div>
</template>

<script>

export default {
  name: 'discover',
  components: {
  },
  data() {
    return {
      searchId: 0,
      step: 0,
      featureRange: {min: 0, max: 100},
      options: {
        valence: [50, 60],
        energy: [50, 60],
        danceability: [50, 60],
      }
    }
  },
  methods: {
    async search(query) {
      console.log(query);
      this.searchId += 1;
      let id = this.searchId;
      let promise = await this.$store.dispatch('searchSpotify', {query: query});
      if (id == this.searchId) {
        console.log(promise);
      }
      else {
        console.log("Skipped");
      }
      
    },
  },
  computed: {
    audioFeatures() {
      return this.$store.state.audioFeatures;
    }
  },
  created() {

  },
}
</script>

<style scoped>
#search-bar {
  padding: 22px;
  padding-bottom: 0px;
  background: rgba(255, 255, 255, 0.048);
}

.theme--dark.v-stepper {
  background: rgb(0,0,0,0);
}

div.v-stepper__header {
  background: rgba(206, 206, 206, 0);
  box-shadow: none;
}

div#header {
  background-image: linear-gradient(45deg, rgb(255, 55, 82),rgb(255, 94, 20));
}

div#header .title {
  display: inline-block;
  padding: 22px 24px;
  color: white;
  text-align: left;
  margin: 0;
  font-size: 32px !important;
}

div.v-stepper__content {
  padding: 0px;
}

.padding {
  display: block;
  width: 100%;
  height: 10px;
  padding: 100px 0px;
  color: rgba(206, 206, 206, 0.603);
}
</style>