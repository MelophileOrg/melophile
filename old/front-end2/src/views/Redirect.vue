<template>
  <div class="redirect">
      <BigTitle/>
      <div class="loading">
        <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import BigTitle from '@/components/BigTitle.vue'

export default {
  name: 'redirect',
  components: {
    BigTitle
  },
  async created() {
      await this.$store.dispatch('parseAccessToken');
      await this.$store.dispatch('inicializeSpotifyApi');
      this.$router.push("/");
  }
}
</script>

<style scoped>
.redirect {
  width: 100vw;
  height: 100vh;
  display: block;
}

.loading {
  margin-top: 25vh;
  transform: scale(3,3);
}
</style>