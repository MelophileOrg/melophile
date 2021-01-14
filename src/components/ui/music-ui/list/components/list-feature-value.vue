<template>
  <span>
    {{ value }}
  </span>
</template>

<script>
export default {
  name: 'ListFeatureLevel',
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
}
</script>
