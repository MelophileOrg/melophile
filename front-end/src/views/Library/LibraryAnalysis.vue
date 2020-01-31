<template>
  <div class="LibraryAnalysis content-padding-hori">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon overview-icon"/>
      <h1 class="page-title">Your Overview</h1>
    </div>

    <div class="flex flex-wrap">
      <div class="window">
        <h1 v-if="userStats != null">{{userStats.track_num}} Tracks</h1>
      </div>
    </div>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'LibraryAnalysis',
  components: {

  },
  data() {
    return {
      userStats: null,
    }
  },
  methods: {
    formatNumber(val) {
      if (val == null) return "0";
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    },
  },
  created() {
    this.userStats = this.jimmy.getStats();
  }
}
</script>

<style scoped>
.overview-icon {
  background-image: url('../../assets/nav-bar-icons/bigpicture.svg');
}
</style>