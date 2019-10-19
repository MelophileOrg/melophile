<template>
  <div class="mycharts">
    <NavBar path="mycharts" />
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'mycharts',
  components: {
    NavBar,
  },
  computed: {
    token() {
      return this.$store.state.access_token;
    },
  },
  created() {

  }
}
</script>

<style scoped>
.mycharts {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>