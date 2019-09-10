<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Background msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Background from '@/components/Background.vue'

export default {
  name: 'home',
  components: {
    Background
  }
}
</script>
