<template>
  <div id="main-flex" class="powerrecommends">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'powerrecommends',
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