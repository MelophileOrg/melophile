<template>
  <div class="Home content-padding">
    <button @click="login">Press Me</button>
    <button @click="process">Process</button>
    <button @click="test">Test</button>
    <h1>{{progressMessage}}</h1>
    <DistributionGraph title="Happiness Distribution"/>
    
  </div>
</template>

<script>
import DistributionGraph from '@/components/Graphs/DistributionGraph.vue'

//import axios from 'axios';

export default {
  name: 'Home',
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
      this.jimmy.checkServer();
    }
  },
  computed: {
    progressMessage() {
      return this.$store.state.progress.message + " " + Math.round(this.$store.state.progress.percent * 100) + "%";
    },
    jimmy() {
      return this.$store.state.jimmy;
    }
  },
  async created() {
    this.test();
  }
}
</script>

<style scoped>
button {
  display: block;
}
</style>
