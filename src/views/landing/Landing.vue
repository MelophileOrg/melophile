<template>
  <div>
    <Entry />

    <Charts />

    <Distributions />

    <Share />
  </div>
</template>

<script>
import Entry from './components/Entry.vue';
import Charts from './components/Charts.vue';
import Distributions from './components/Distributions.vue';
import Share from './components/Share.vue';

export default {
  name: 'Landing',
  components: {
    Entry,
    Charts,
    Distributions,
    Share,
  },
};
</script>
