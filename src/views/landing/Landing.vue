<template>
  <div>
    <landing-app-bar />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import LandingAppBar from '@/components/ui/app-bar/landing/landing-app-bar.vue';

export default Vue.extend({
  name: 'landing',

  components: {
    LandingAppBar,
  },
});
</script>

<style lang="scss" module>
</style>
