<template>
  <div class="topcharts">
    <PageTitle title="Your Charts" description="See what you've been listening and save most."/>
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
    </v-tabs>
    
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from '@/components/General/PageTitle.vue'

export default {
  name: 'topcharts',
  components: {
    PageTitle
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