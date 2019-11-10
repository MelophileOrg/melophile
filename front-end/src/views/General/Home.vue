<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <button @click="login">Login</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'

export default {
  name: 'home',
  components: {
    NavBar,
  },
  methods: {
    login() {
      this.$router.push('/login');
    }
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
