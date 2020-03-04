<template>
  <div class="LibraryAnalysis content-padding-hori" v-resize="onResize">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon overview-icon"/>
      <h1 class="page-title">Your Library Overview</h1>
    </div>
    <Stats :stats="stats"/>
    <AddedTimeline :width="windowSize.x"/>


  </div>
</template>

<script>
let axios = require('axios');

import Stats from '@/components/LibraryAnalysis/Stats.vue'
import AddedTimeline from '@/components/LibraryAnalysis/AddedTimeline.vue'

export default {
  name: 'LibraryAnalysis',
  components: {
    Stats,
    AddedTimeline
  },
  data() {
    return {
      audioFeatures: null,
      stats: null,
      windowSize: {x: 0, y: 0},
    }
  },
  methods: {
    onResize() {
      let diff = 240 + 32;
      if (window.innerWidth < 1264) diff = 32;
      this.windowSize = {x: window.innerWidth - diff, y: window.innerHeight};
    },
    formatNumber(val) {
      if (val == null) return "0";
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    graphWidth() {
      if (window.innerWidth < 1264) return this.windowSize.x;
      return (this.windowSize.x / 2.9) - 46;
    },
    token() {
      return this.$store.state.authentication.accessToken;
    }
  },
  async created() {
    await this.onResize();
    this.stats = (await axios.put('/api/me/stats', {token: this.token})).data;
    this.audioFeatures = await axios.put('/api/me/features/all', {token: this.token});
  }
}
</script>

<style scoped>
.overview-icon {
  background-image: url('../../assets/nav-bar-icons/bigpicture.svg');
}

.distribution {
  border-radius: 3px;
  margin-bottom: 15px;
  margin-top: 10px;
}

.windows-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
}

@media only screen and (max-width: 875px) {
    .windows-div {
        justify-content: space-around;
    }
}

.third {
    width: 31%;
}

@media only screen and (max-width: 875px) {
    .third {
        width: 100%;
        margin: 15px 0px;
    }
}
</style>