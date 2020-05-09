<template>
  <v-row class="TwoColumnLayout">
    <div class="core-content">
      <slot name="core"></slot>
    </div>
    <div class="aside">
      <slot name="aside"></slot>
    </div>
  </v-row>
</template>

<script>
export default {
  name: "TwoColumnLayout"
}
</script>

<style scoped>
.core-content {
  display: block;
  width: 720px;
  margin-right: 24px;
}

.aside {
  display: block;
  width: 384px;
}
</style>