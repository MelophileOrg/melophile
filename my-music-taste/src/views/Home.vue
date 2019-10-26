<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <button @click="test">Test</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'home',
  components: {
    NavBar
  },
  methods: {
    test() {
      this.$router.push('/test');
    }
  }
}
</script>
