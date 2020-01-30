<template>
  <div class="Charts content-padding-hori">
    <h1 class="page-title slide-up" :style="{'--delay': + 0}">Your Top Charts</h1>
    <div class="page-bar">
      <v-tabs background-color="#393945" color="#52e3c2">
        <v-tab> 
          Top Played
        </v-tab>
        <v-tab> 
          Top Saved
        </v-tab>
        <v-tab> 
          Extremes
        </v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Charts',
  components: {

  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    }
  },
  created() {
    this.jimmy.checkServer();
  }
}
</script>

<style scoped>
.charts-title {
  color: white;
  font-size: 2rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
  margin: 0px;
}
</style>