<template>
  <div class="home">
    <button @click="login">Press Me</button>
    <button @click="process">Process</button>
    <button @click="clientNum">Connected</button>
    <h1>{{progressNum}}</h1>
    <h1>{{progressMessage}}</h1>
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
      this.$socket.client.emit('login');
    },
    clientNum() {
      this.$socket.client.emit('getClientNum');
    },
    process() {
      this.$socket.client.emit('process', {accessToken: this.$store.state.authentication.accessToken});
    }
  },
  computed: {
    progressNum() {
      if (this.$store.state.progress.tracks.total != 0)
        return this.$store.state.progress.tracks.processed + " / " + this.$store.state.progress.tracks.total;
      return "Not Started";
    },
    progressMessage() {
      return this.$store.state.progress.message;
    },
  },
  created() {
    
  }
}
</script>

<style scoped>
button {
  display: block;
}
</style>
