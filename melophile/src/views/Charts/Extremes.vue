<template>
  <div class="Extremes">
    <PageHeader title="Your Extreme Charts"/>
    <div class="selectors page-margin padding-2 flex flex-align-center elevation-1">
      <p class="selector-context">my tracks with the</p>
      <v-select @change="getExtremes" hide-details v-model="sort" :items="sorts" dense background-color="rgba(100,100,100,0)" class="selector" :style="{'--width': + sortsWidth}" item-color="melophile-green" color="melophile-green"/>
      <v-select @change="getExtremes" hide-details v-model="feature" :items="features" dense background-color="rgba(100,100,100,0)" class="selector" :style="{'--width': + featuresWidth}" item-color="melophile-green" color="melophile-green"/>
      <p class="selector-context">value</p>
    </div>
    <List type="track" :list="chart" label="index"/>
  </div>
</template>

<script>
import axios from 'axios';

import PageHeader from '@/components/General/PageHeader.vue'
import List from '@/components/Lists/List.vue';

export default {
  name: 'Extremes',
  components: {
    PageHeader,
    List,
  },
  data: () => ({
    sort: 0,
    sortsWidth: 90,
    sorts: [
      {text: "highest", parameter: "max", value: 0},
      {text: "lowest", parameter: "min", value: 1}
    ],
    feature: 0,
    featuresWidth: 175,
    features: [
      {text: "happiness", value: 0, parameter: 'valence'},
      {text: "danceability", value: 1, parameter: 'danceability'}, 
      {text: "energy", value: 2, parameter: 'energy'}, 
      {text: "tempo", value: 3, parameter: 'tempo'}, 
      {text: "acousticness", value: 4, parameter: 'acousticness'},
      {text: "instrumentalness", value: 5, parameter: 'instrumentalness'},
      {text: "liveness", value: 6, parameter: 'liveness'},
      {text: "speechiness", value: 7, parameter: 'speechiness'}
    ],
    chart: [],
  }),
  methods: {
    async getExtremes() {
      try {
        if (this.chart.length) this.chart = [];
        let response = await axios.get('/api/me/charts/extremes/' + this.sorts[this.sort].parameter + '/' + this.features[this.feature].parameter);
        this.chart = response.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>

<style scoped>
.selectors {
  margin-top: 12px;
  background: var(--dark-3);
  padding-bottom: 12px;
}

p.selector-context {
  margin: 0;
  margin-right: 5px;
  margin-bottom: 0px;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.486);
  font-weight: normal;
}

.selector {
  --width: 0;
  max-width: calc(var(--width) * 1px);
  min-width: calc(var(--width) * 1px);
  max-height: 48px !important;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
}
</style>