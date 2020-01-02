<template>
  <div id="main-flex" class="boringradar">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'

export default {
  name: 'boringradar',
  components: {
    NavBar
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>