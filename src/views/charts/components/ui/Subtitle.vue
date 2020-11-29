<template functional>
  <h2 :class="$style.component">
    {{ props.text }}
  </h2>
</template>

<script>
export default {
  functional: true,
  name: 'Subtitle',
  props: {
    text: {
      type: String,
    },
  },
};
</script>

<style module>
.component {
  font-size: 1.8rem;
}
</style>
