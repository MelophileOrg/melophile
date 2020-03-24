<template>
  <div class="TopSaved">
    <PageHeader title="Your Top Saved Charts"/>
    <div class="selectors page-margin padding-2 flex flex-align-center elevation-1">
      <p class="selector-context">top saved</p>
      <v-select @change="getTopSaved" hide-details v-model="type" :items="types" dense background-color="rgba(100,100,100,0)" class="selector" :style="{'--width': + typesWidth}" item-color="melophile-green" color="melophile-green"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import PageHeader from '@/components/General/PageHeader.vue'

export default {
  name: 'TopSaved',
  components: {
    PageHeader,
  },
  data: () => ({
    type: 0,
    typesWidth: 85,
    types: [
      {text: 'artists', value: 0, parameter: 'artist'},
      {text: 'genres', value: 1, parameter: 'genre'}
    ],
    chart: [],
  }),
  methods: {
    async getTopSaved() {
        this.chart = [];
        let response = await axios.get('/api/me/charts/topsaved/' + this.types[this.type].text);
        console.log(response);
        this.chart = response.data;
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