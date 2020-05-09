<template>
  <v-row class="ThreeColumnLayout">
    <slot name="aside" class="aside"></slot>
    <slot name="core" class="core-content"></slot>
    <slot name="right" class="right-content"></slot>
  </v-row>
</template>

<script>
export default {
  name: "ThreeColumnLayout"
}
</script>

<style scoped>
.aside {
  width: 225px;
  margin-right: 24px;
}

.core-content {
  width: 564px;
  margin-right: 24px;
}

.right-content {
  width: 330px;
}
</style>