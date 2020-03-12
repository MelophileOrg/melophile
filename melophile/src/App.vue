<template>
  <v-app v-resize="onResize" class="melophile">
    <v-navigation-drawer clipped app floating v-model="drawer" :width="210" color="melophile-dark-2">
      <v-tabs class="nav-bar-tabs" v-model="tab" @change="route" vertical :grow="true" :show-arrows="false" background-color="melophile-dark-2" slider-color="melophile-green" color="white" :slider-size="3">
        <div v-for="tab in tabs" :key="tab.text">
          <v-tab class="nav-bar-tab" v-if="tab.type == 'link' || tab.type == 'list'">
            <img class="nav-bar-tab-icon" :src="getImgUrl(tab.image)"/>
            <p class="nav-bar-tab-text">{{tab.text}}</p>
          </v-tab>
          <p class="nav-bar-category" v-if="tab.type == 'category'">{{tab.text}}</p>
        </div>
      </v-tabs>
    </v-navigation-drawer>

    <v-app-bar app dark clipped-left color="melophile-dark-2" :elevation="0">
      <p class="melophile-title">melophile</p>
      <v-app-bar-nav-icon v-if="windowSize.x < 1264" @click.stop="closeDrawer"/>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {

  },
  data: () => ({
    tab: 0,
    drawer: true,
    tabs: [
      {text: "Home", type: "link", route: "home", image: "home"},
      {text: "Discover", type: "link", route: "discover", image: "discover"},
      {text: "Your Charts", type: "category"},
      {text: "Top Played", type: "link", route: "discover", image: "topplayed"},
      {text: "Top Saved", type: "link", route: "discover", image: "topsaved"},
      {text: "Extremes", type: "link", route: "discover", image: "extremes"},
      {text: "Your Library", type: "category"},
      {text: "Overview", type: "link", route: "discover", image: "overview"},
      {text: "Library", type: "link", route: "library", image: "library-2"},
      {text: "History", type: "link", route: "history", image: "history"},
      {text: "Social", type: "category"},
      {text: "My Profile", type: "link", route: "myprofile", image: "profile"},
      {text: "Public Profiles", type: "link", route: "publicprofiles", image: "public"},
    ],
    windowSize: {x: 0, y: 0},
  }),
  methods: {
    closeDrawer() {
      this.drawer = !this.drawer;
    },
    getImgUrl(pic) {
      var images = require.context('./assets/navbar', false, /\.svg$/);
      return images('./' + pic + ".svg");
    },
    route() {
      console.log("route");
    },
    onResize() {
      this.windowSize = {x: window.innerWidth, y: window.innerHeight};
    },
    login() {
      this.$store.dispatch('login');
    }
  }, 
  created() {
    this.$store.dispatch('getUser');
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700|Roboto:300,400,500,700,900&display=swap');
/*
font-family: 'Roboto', sans-serif;
font-family: 'Open Sans', sans-serif;
*/

:root {
  --red: #ff4495;
  --green: #52e3c2;
  --light-blue: #40c4ff;
  --blue: #0781ff;
  --purple: #d211fe;
  --orange: #ff4b12;
  --light-orange: #ed8a19;
  --yellow: #ffd900;
  --gray: #546e7a;
  --dark-0: #1a1a21;
  --dark-1: #282833;
  --dark-2: #32323e;
  --dark-3: #393945;
  --dark-4: #40424f;
  --dark-5: #4d505f;
  --dark-6: #6e7288;
  --dark-7: #8f94ab;
  --dark-8: #b4b8cd;
  --text: #fdfdfd;
}

.melophile {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text);
}

html::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: #32323e;
}

html::-webkit-scrollbar
{
    width: 5px;
    background-color: rgba(6, 6, 6, 0.007)
}

html::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.288);
}

.v-application {
  background: var(--dark-2) !important;
}

p.melophile-title {
  font-size: 2rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  margin: 0px 3px 0px 3px !important;
 
  text-transform: lowercase;
}

.nav-bar-tabs {
  margin-top: 5px;
}

.nav-bar-tab.v-tab {
  padding-left: 20px;
  justify-content: left;
  align-items: center;
}

p.nav-bar-tab-text {
  display: inline-block;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  font-size: 1rem;
  text-align: left;
  text-transform: lowercase;
  margin: 0px 0px 0px 10px !important;
}

p.nav-bar-category {
  text-transform: uppercase;
  color: var(--dark-5);
  font-size: .8rem;
  letter-spacing: 1px;
  margin: 0px 0px 0px 18px !important;
  padding-top: 10px;
}

.nav-bar-tab-icon {
  display: block;
  width: 22px;
  height: 22px;
  margin-right: 8px;
}


</style>

<style>
.flex {
  display: flex;
}

.flex-align-center {
  align-items: center;
}

.flex-justify-center {
  justify-content: center;
}

.flex-justify-left {
  justify-content: left;
}

.flex-justify-space-around {
  justify-content: space-around;
}

.flex-justify-space-between {
  justify-content: space-between;
}
</style>
