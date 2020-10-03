<template>
  <div
    class="limit-width"
    :class="$style.component">

    <slot name="header" />

    <div :class="$style.container">
      <div :class="$style.aside">
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
  flex-grow: 1;
  margin-right: 2.5rem;
  max-width: 30rem;
}
</style>