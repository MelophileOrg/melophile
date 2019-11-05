<template>
  <div id="main-flex" class="genreanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import GoBackSearch from '@/components/Library/GoBackSearch.vue'

export default {
  name: 'genreanalysis',
  components: {
      NavBar,
      GoBackSearch,
  },
  data() {
      return {
        genreData: null,
      }
  },
  methods: {
    getData() {
      this.genreData = this.genres[this.$route.params.id];
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    genres() {
      return this.$store.state.genres;
    }
  },  
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    if (!this.inicialized)
      this.$router.push("/login");

  }
}

</script>

<style scoped>

</style>