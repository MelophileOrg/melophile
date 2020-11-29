<template>
  <div :class="$style.component">
    <h1 :class="$style.title">
      Your Top Charts
    </h1>

    <!-- <v-tabs
      grow
      centered>
      <v-tab
        v-for="chart in charts"
        :key="`top-chart-${chart}`">
        {{ chart }}
      </v-tab>
    </v-tabs>

    <div :class="$style.actions">
      <v-select
        :items="types"
        :value="types[0]"
        outlined
        dense />

      <v-select
        :items="terms"
        :value="terms[0]"
        outlined
        dense />
    </div> -->
  </div>
</template>

<script>
import {
  TERMS,
  TYPES,
  CHARTS,
} from '../../config';

export default {
  name: 'ChartHeader',
  data: () => ({
    types: TYPES,
    terms: TERMS,
    charts: CHARTS,
  }),
  methods: {

  },
};
</script>

<style module>
.component {
  padding: 5rem 0;
}

.title {
  font-size: 4rem;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
