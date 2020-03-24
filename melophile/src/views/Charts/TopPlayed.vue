<template>
  <div class="TopPlayed">
    <PageHeader title="Your Top Played Charts"/>
    <div class="selectors page-margin padding-2 flex flex-align-center elevation-1">
      <p class="selector-context">top played</p>
      <v-select @change="getTopPlayed" hide-details v-model="type" :items="types" dense background-color="rgba(100,100,100,0)" class="selector" :style="{'--width': + typesWidth}" item-color="melophile-green" color="melophile-green"/>
      <p class="selector-context">in the last few</p>
      <v-select @change="getTopPlayed" hide-details v-model="timeRange" :items="timeRanges" dense background-color="rgba(100,100,100,0)" class="selector" :style="{'--width': + timeRangesWidth}" item-color="melophile-green" color="melophile-green"/>
    </div>
    <List :type="types[type].parameter" :list="chart" label="index"/>
  </div>
</template>

<script>
import axios from 'axios';

import PageHeader from '@/components/General/PageHeader.vue';
import List from '@/components/Lists/List.vue';

export default {
  name: 'TopPlayed',
  components: {
    PageHeader,
    List,
  },
  data: () => ({
    type: 0,
    typesWidth: 80,
    types: [
      {text: 'tracks', value: 0, parameter: 'track'},
      {text: 'artists', value: 1, parameter: 'artist'}
    ],
    timeRange: 2,
    timeRangesWidth: 90,
    timeRanges: [
      {text: 'years', value: 2},
      {text: 'months', value: 1},
      {text: 'weeks', value: 0},
    ],
    chart: [],
  }),
  methods: {
    async getTopPlayed() {
      try {
        if (this.chart.length) this.chart = [];
        let response = await axios.get('/api/me/charts/topplayed/' + this.types[this.type].text + '/' + this.timeRange);
        this.chart = response.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getTopPlayed();
  }
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