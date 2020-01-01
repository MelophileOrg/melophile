<template>
  <div class="topcharts">
    <div id="page-title">
      <div id="top-charts" class="page-title-icon"></div>
      <h1 id="page-title-text">Your Top Charts</h1>
    </div>
    <v-tabs @change="changeTab" fixed-tabs background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
      <v-tab-item :value="0">
        <TopPlayed/>
      </v-tab-item>
      <v-tab-item :value="1">
        <TopSaved/>
      </v-tab-item>
      <v-tab-item :value="2">
        <Extremes/>
      </v-tab-item>
    </v-tabs>


    
  </div>
</template>

<script>
import TopPlayed from '@/components/Lists/TopPlayed.vue'
import TopSaved from '@/components/Lists/TopSaved.vue'
import Extremes from '@/components/Lists/Extremes.vue'

export default {
  name: 'topcharts',
  components: {
    TopPlayed,
    TopSaved,
    Extremes
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: "Top Played"},
        {text: "Top Saved"},
        {text: "Extremes"}
      ],
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
    }
  },
  computed: {
    progress() {
      return this.$store.state.progress;
    }
  },
  created() {
  },
}
</script>

<style scoped>
div.v-tab {
  justify-content: center;
}
</style>