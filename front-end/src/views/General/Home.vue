<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <button @click="login">Login</button>
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
