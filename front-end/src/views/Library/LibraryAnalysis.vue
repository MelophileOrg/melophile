<template>
  <div class="LibraryAnalysis">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon overview-icon"/>
      <h1 class="page-title">Your Overview</h1>
    </div>
    <div class="page-bar slide-up" :style="{'--delay': + 1}">
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
  name: 'LibraryAnalysis',
  components: {

  },
}
</script>

<style scoped>
.overview-icon {
  background-image: url('../../assets/nav-bar-icons/bigpicture.svg');
}
</style>