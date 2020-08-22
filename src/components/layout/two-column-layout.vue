<template>
  <div
    class="limit-width"
    :class="$style.component">
    <div :class="$style.content">
      <slot name="content" />
    </div>

    <div :class="$style.aside">
      <slot name="aside" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoColumnLayout',
};
</script>

<style scoped>
.component {
  display: flex;
}

.component .content {
  flex-grow: 2;
}

.component .aside {
  flex-grow: 1;
  margin-left: 2.5rem;
}
</style>