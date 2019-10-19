<template>
  <div class="songanalysis">
    <NavBar path="songanalysis" />
    <div id="main">
      <SearchBar/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'songanalysis',
  components: {
    NavBar,
    SearchBar
  },
  computed: {
    token() {
      return this.$store.state.access_token;
    },
  },
  created() {
    if (!this.$store.state.inicialized) {
      this.$store.dispatch('getAccessToken');
    }
  }
}
</script>

<style scoped>
.songanalysis {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>