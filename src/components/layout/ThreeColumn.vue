<template>
  <v-container class="ThreeColumn limit-width">
    <slot name="right-aside"/>
    <slot name="content"/>
    <slot name="left-aside"/>
  </v-container>
</template>

<script>
export default {
  name: 'ThreeColumn',
  data: () => ({
  }),
};
</script>
