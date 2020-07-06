<template>
  <v-container class="TwoColumn limit-width">
    <slot name="content"/>
    <slot name="left-aside"/>
  </v-container>
</template>

<script>
export default {
  name: 'TwoColumn',
  data: () => ({
  }),
};
</script>
