<template>
  <div class="MonthAnalysis">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <h1 class="page-title">Month Analysis</h1>
    </div>
    <div class="page-bar slide-up elevation-1" :style="{'--delay': + 1}">
      <v-tabs background-color="#393945" color="#52e3c2" v-model="tab" show-arrows>
        <v-tab> 
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-poll-box</v-icon>
          Overview
        </v-tab>
        <v-tab> 
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-music-box-outline</v-icon>
          Tracks
        </v-tab>
      </v-tabs>
    </div>

  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'MonthAnalysis',
  components: {

  },
  data() {
    return {
      tab: 0,
    }
  }
}
</script>

<style scoped>
</style>