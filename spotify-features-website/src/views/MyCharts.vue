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
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created() {
    if (this.inicialized)
    {
      console.log(this.$store.dispatch('getRecentlyPlayed',{limit: 20}));
    }
    else {
      this.$router.push("/login");
    }
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