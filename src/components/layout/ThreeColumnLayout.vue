<template>
  <div
    class="limit-width"
    :class="$style.component">
    <div :class="[$style.aside, $style.left]">
      <slot name="left-aside" />
    </div>

    <div :class="$style.content">
      <slot name="content" />
    </div>

    <div :class="[$style.aside, $style.right]">
      <slot name="right-aside" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThreeColumnLayout',
};
</script>

<style module>
.component {
  display: flex;
}

.component .content {
  flex-grow: 2;
}

.component .aside {
  flex-grow: 1;
}

.component .aside .right {
  margin-left: 2.5rem;
}

.component .aside .left {
  margin-right: 2.5rem;
}
</style>
