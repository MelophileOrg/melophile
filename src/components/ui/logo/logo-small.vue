<template>
  <div :class="$style.component">
    <img
      src="../../../assets/icons/logo/logo-48.svg"
      :class="$style.logo" />

    <span :class="$style.title">
      melophile
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'logo-small',
});
</script>

<style lang="scss" module>
.component {
  align-items: center;
  cursor: pointer;
  display: flex;
}

.logo {
  $size: 2.4rem;

  display: block;
  height: $size;
  width: $size;
}

.title {
  margin-left: 1rem;
  color: white;
  font-size: 1.7rem;
}
</style>
