<template>
  <div class="redirect">
      <h1>HI</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'redirect',
  created() {
      this.$store.dispatch('parseAccessToken');
  }
}
</script>

<style scoped>

</style>