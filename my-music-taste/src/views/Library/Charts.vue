<template>
  <div id="main-flex" class="charts">
    <NavBar/>
    <div id="main">
      <div v-if="progress.genresLoaded" id="menu">
        <h1>Your Charts</h1>
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Top Played</h2>
          <h2 @click="changeTab(1)" :class="{active: tab == 1}">Top Saved</h2>
        </div>
      </div>
      <div v-if="tab == 0 && progress.genresLoaded" class="charts-div">
        <TopPlayed/>
      </div>
      <div v-if="tab == 1 && progress.genresLoaded" class="charts-div">
        <TopSaved/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import TopSaved from '@/components/Library/TopSaved.vue'
import TopPlayed from '@/components/Library/TopPlayed.vue'

export default {
  name: 'charts',
  components: {
    NavBar,
    TopSaved,
    TopPlayed
  },
  data() {
    return {
        tab: 0,
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    }
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>

#menu {
  width: calc(100% - 64px);
  padding: 10px 32px;
  margin-bottom: 10px;
}

h1 {
    color: #fff;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
}

h2.active {
  color: white;
}

#tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 100vw;
  flex-wrap: wrap;
}

h2 {
  color: rgba(255, 255, 255, 0.452);
  margin: 10px 20px;
  cursor: pointer;
  transition: all .3s ease;
  animation: slide-up .3s ease .1s, hide .1s linear;
}

.charts-div {

}
</style>