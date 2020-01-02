<template>
  <div class="home">
    <button @click="login">Press Me</button>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {

  },
  methods: {
    async login() {
      await this.$store.dispatch('login');
    }
  }
}
</script>
