<template>
  <div id="main-flex" class="charts">
    <NavBar/>
    <div id="main">
      <PageTitle title="Your Top Charts" link="/social/save" linkTitle="Share"/>
      <div v-if="progress.genres" id="menu">
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Top Played</h2>
          <h2 @click="changeTab(1)" :class="{active: tab == 1}">Top Saved</h2>
          <h2 @click="changeTab(2)" :class="{active: tab == 2}">Extremes</h2>
        </div>
      </div>
      <v-tabs active-class="active" background-color="rgba(0,0,0,0)">
        <v-tab>Top Played</v-tab>
        <v-tab>Top Saved</v-tab>
        <v-tab>Top Extremes</v-tab>
      </v-tabs>
      <div v-if="tab == 0 && progress.genres" class="charts-div">
        <TopPlayed :profile="false"/>
      </div>
      <div v-if="tab == 1 && progress.genres" class="charts-div">
        <TopSaved :profile="false"/>
      </div>
      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import PageTitle from '@/components/Menu/PageTitle.vue'
import TopSaved from '@/components/Lists/TopSaved.vue'
import TopPlayed from '@/components/Lists/TopPlayed.vue'
import Progress from '@/components/General/Progress.vue'

export default {
  name: 'charts',
  components: {
    NavBar,
    TopSaved,
    TopPlayed,
    PageTitle,
    Progress
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
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>

<style scoped>

#menu {
  width: calc(100% - 64px);
  padding: 10px 32px;
  animation: slide-up .3s ease .1s, hide .1s linear;
}

h1 {
    color: #fff;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
}

.active {
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
  
}

@media only screen and (max-width: 500px) {
  h1 {
    display: none;
  }

    h2 {
    font-size: 1.2em;
  }

  #menu {
    padding: 10px 0;
    width: 100vw;
    margin-bottom: 20px;
    background-color: rgba(255, 251, 251, 0.048) !important;
  }
}
</style>