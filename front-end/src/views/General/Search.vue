<template>
  <div id="main-flex" class="search">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'

export default {
  name: 'search',
  components: {
    NavBar,
  },
  methods: {

  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>