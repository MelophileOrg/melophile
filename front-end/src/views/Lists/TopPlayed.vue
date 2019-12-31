<template>
  <div class="topcharts">


    
  </div>
</template>

<script>


export default {
  name: 'topcharts',
  components: {

  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: "Tracks"},
        {text: "Artists"},
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