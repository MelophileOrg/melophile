<template>
  <div
    class="limit-width"
    :class="$style.component">

    <slot name="header" />

    <div :class="$style.container">
      <div
        :class="$style.aside"
        :style="{'--width': asideWidth}">
        <slot name="aside" />
      </div>

      <div :class="$style.content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoColumnLayout',
  props: {
    asideWidth: {
      type: Number,
      default: 30,
    },
  },
};
</script>

<style module>
.component {
  margin-top: 5rem;
}

.container {
  display: flex;
}

.container .content {
  flex-grow: 4;
}

.container .aside {
  --width: 30;
  flex-grow: 1;
  margin-right: 2.5rem;
  max-width: calc(var(--width) * 1rem);
}
</style>