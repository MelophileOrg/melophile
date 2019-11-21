<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <button @click="login">Login</button>
      <v-tabs @change="change" background-color="rgba(0,0,0,0)" color="#ffffff">
        <v-tab>Top Played</v-tab>
        <v-tab>Top Saved</v-tab>
        <v-tab>Top Extremes</v-tab>
      </v-tabs>
      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import Progress from '@/components/General/Progress.vue'

export default {
  name: 'home',
  components: {
    NavBar,
    Progress
  },
  methods: {
    login() {
      this.$router.push('/login');
    },
    change(value) {
      console.log(value);
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
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

<style scoped>
</style>
