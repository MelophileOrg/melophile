<template>
  <div class="home">
    <button @click="login">Press Me</button>
    <button @click="process">Process</button>
    <button @click="test">Test</button>
    <h1>{{progressMessage}}</h1>
    <DistributionGraph title="Happiness Distribution"/>
    
  </div>
</template>

<script>
// @ is an alias to /src
import DistributionGraph from '@/components/Graphs/DistributionGraph.vue'

export default {
  name: 'home',
  components: {
    DistributionGraph,
  },
  data() {
    return {
      graph_data: {

      }
    }
  },
  methods: {
    async login() {
      this.$store.dispatch('login', {instance: this});
    },
    process() {
      this.$store.dispatch('process', {instance: this});
    },
    test() {
      this.$socket.client.emit('test');
    }
  },
  computed: {
    progressMessage() {
      return this.$store.state.progress.message + " " + Math.round(this.$store.state.progress.percent * 100) + "%";
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
