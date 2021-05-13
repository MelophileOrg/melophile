<template functional>
  <h1 :class="$style.component">
    {{ props.text }}
  </h1>
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
  font-size: 2.2rem;
  margin: 1.2rem 0;
}
</style>
