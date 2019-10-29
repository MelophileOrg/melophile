<template>
  <div id="main-flex" class="songanalysis">
    <NavBar/>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'

export default {
    name: 'songanalysis',
    components: {
        NavBar
    },
    data() {
        return {
        trackData: null,
        }
    },
    methods: {

    },
    computed: {

    },  
    async created() {
      this.trackData = await this.$store.dispatch('songAnalysis', this.$route.params.id);
    }
}

</script>

<style scoped>
p {
  color: white;
}
</style>