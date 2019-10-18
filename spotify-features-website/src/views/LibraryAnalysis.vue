<template>
  <div class="libraryanalysis">
    <NavBar path="libraryanalysis" />
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'libraryanalysis',
  components: {
    NavBar,
  },
  computed: {
    token() {
      return this.$state.store.access_token;
    }
  },
  created() {
    if (!token) {
      this.$router.push('token');
    }
  }
}
</script>

<style scoped>
.libraryanalysis {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>