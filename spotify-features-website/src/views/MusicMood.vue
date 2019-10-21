<template>
  <div class="musicmood">
    <NavBar path="mymusicmood" />
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'musicmood',
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
.mymusicmood {
  display: flex;
  width: 100vw;
  min-height: 100vh;
}
</style>