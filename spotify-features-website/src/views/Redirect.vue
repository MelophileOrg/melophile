<template>
  <div class="redirect">
      <h1>HI</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'redirect',
  async created() {
      await this.$store.dispatch('parseAccessToken');
      await this.$store.dispatch('inicializeSpotifyApi');
      this.$router.push("/");
  }
}
</script>

<style scoped>

</style>