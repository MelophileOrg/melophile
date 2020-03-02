<template>
  <div class="Home content-padding">
    <button @click="login">Press Me</button>
    <button @click="process">Process</button>
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
  },
  computed: {
    progressMessage() {
      return this.$store.state.progress.message + " " + Math.round(this.$store.state.progress.percent * 100) + "%";
    },
  },
  async created() {
  }
}
</script>

<style scoped>
button {
  display: block;
}
</style>
