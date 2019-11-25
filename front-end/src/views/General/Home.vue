<template>
  <div class="home">
    <h1 @click="login">Home</h1>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    
  },
  data() {
    return {
      
    }
  },
  methods: {
    login() {
      this.$store.dispatch('inicializeGetToken');
    },
    
  },
  created() {

  },
}
</script>
