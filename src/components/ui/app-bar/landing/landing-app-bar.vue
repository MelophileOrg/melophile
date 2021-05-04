<template>
  <div :class="$style.component">
    <small-logo />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import SmallLogo from '@/components/ui/logo/logo-small.vue';

export default Vue.extend({
  name: 'landing-app-bar',

  components: {
    SmallLogo,
  },
});
</script>

<style lang="scss" module>
@import '@melophile/melophile-ui/src/styles/config.scss';

.component {
  align-items: center;
  display: flex;
  background-color: $dark-grey-800;
  height: 6.4rem;
  padding-left: 2.1rem;
}
</style>
