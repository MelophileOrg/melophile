<template>
  <div class="musicmood maindiv">
    <NavBar path="recommends" />
    <h1 id="development">Currently Unavailable</h1>
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
    testing() {
      return !this.$store.state.testing;
    }
  },
  created() {

  }
}
</script>

<style scoped>
#development{
  color: white; 
  font-size: 4em;
  margin: 0 auto;
  margin-top: 15vh;
}
</style>