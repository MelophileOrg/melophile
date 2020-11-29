<template>
  <div :class="$style.component">
  </div>
</template>

<script>
export default {
  name: 'LongList',
  props: {
    id: {
      type: String,
      default: Math.random().toString(36).substring(7),
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: 'track',
    },
  },
};
</script>

<style module>
</style>
