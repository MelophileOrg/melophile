<template>
  <div id="main-flex" class="login">
    <NavBar/>
    <div id="main">
      <button @click="login">Authorize</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'login',
  components: {
    NavBar
  },
  methods: {
    login() {
      this.$store.dispatch('inicializeGetToken');
    }
  }
}
</script>