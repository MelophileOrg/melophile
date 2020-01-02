<template>
  <v-app v-resize="onResize" id="app">
    <v-app-bar v-if="windowSize.x < 1264" app clipped-left color="rgba(0,0,0,0)" dense>
      <img src="./assets/logo.svg">
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Melomaniac</span>
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-navigation-drawer class="nav-bar" app clipped v-model="drawer" color="rgb(255,255,255)" >
      <div v-if="windowSize.x > 1264" class="flex flex-align-center nav-drawer-title">
        <img src="./assets/logo.svg"/>
        <h1>Melomaniac</h1>
      </div>
      <div class="spacer" v-if="windowSize.x <= 1264">Menu</div>
      <v-tabs v-model="tab" @change="route" vertical background-color="rgba(0,0,0,0)" :grow="true">
        <div v-for="(tab, index) in tabs" :key="'nav-bar-tab-' + tab.title + index">
          <v-tab v-if="tab.type == 'link'">
            <img class="nav-icon" :src="getImgUrl(tab.img)"/>
            {{tab.title}}
          </v-tab>
          <v-subheader v-if="tab.type == 'subheader'" class="mt-4 grey--text text--darken-1">{{tab.title}}</v-subheader>
        </div>
      </v-tabs>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
      <div id="alerts">
        <v-alert :width="alertWidth()" border="left" dense dismissible :elevation="5" 
        type="info" transition="scale-transition" :icon="false"
        :value="progress.total != 0 && progress.processed < progress.total && !progress.tracks && !progress.artists && !progress.genres && !progress.charts && !progress.timelines">
          <v-progress-circular color="rgb(255,255,255)" :size="20" :value="(progress.processed / progress.total) * 100" />
          Loading Your Library
        </v-alert>
        <v-alert :width="alertWidth()" border="left" dense dismissible :elevation="5" type="success" transition="scale-transition" :value="progress.total != 0 && progress.processed >= progress.total && progress.tracks && progress.artists && progress.genres && progress.charts && progress.timelines">Finished Analysizing Library</v-alert>
        <v-alert :width="alertWidth()" border="left" dense dismissible :elevation="5" type="error" transition="scale-transition" :value="false">Error with Loading Library</v-alert>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: "app",
    data: () => ({
      drawer: null,
      tab: 0,
      tabs: [
        {type: 'link', title: 'Home', img: 'home', path: '/'},
        {type: 'link', title: 'Search', img: 'search', path: '/search'},
        {type: 'link', title: 'Discover', img: 'discover', path: '/discover'},
        {type: 'subheader', title: 'Your Library'},
        {type: 'link', title: 'Library', img: 'library', path: '/library'},
        {type: 'link', title: 'History', img: 'history', path: '/history'},
        {type: 'link', title: 'Charts', img: 'chart', path: '/charts'},
        {type: 'subheader', title: 'Social'},
        {type: 'link', title: 'My Profile', img: 'profile', path: '/social'},
        {type: 'link', title: 'Public Profiles', img: 'public', path: '/social'},
      ],
      windowSize: {x: 0, y: 0},
      first: true,
    }),
    methods: {
      getImgUrl(pic) {
          var images = require.context('./assets/nav-bar-icons', false, /\.svg$/);
          return images('./' + pic + ".svg");
      },
      route(index) {
        let routes = this.tabs.filter(tab => tab.type == 'link').map(tab => tab.path);
        if (routes[index] == this.$route.fullPath)
          return;
        if (this.first) {
          this.first = false;
        }
        this.$router.push(routes[index]);
        window.scroll({
          top: 0,
          behavior: 'auto'
        });
      },
      onResize() {
        this.windowSize = {x: window.innerWidth, y: window.innerHeight};
      },
      alertWidth() {
        let w;
        if (this.windowSize.x < 1264) {
          w = this.windowSize.x * .9;
        }
        else {
          w = (this.windowSize.x - 256) * .9;
        }
        if (w > 400)
          return 400;
        return w;
      }
    },
    computed: {
      progress() {
        return this.$store.state.progress;
      }
    },
    created () {
      this.$vuetify.theme.dark = true;
      let tabs = ["home", "discover", "search", "bigpicture", "topcharts", "library", "myprofile", "publicprofiles"];
      if (this.$route.name == "profile")
        this.tab = tabs.indexOf("publicprofiles");
      else {
        let tabFound = tabs.indexOf(this.$route.name);
        if (tabFound == -1) 
          this.tab = 0;
        else 
          this.tab = tabFound;
      }
      
    },
    mounted() {
      this.onResize();
    }
  }
</script>

<style>/* Fonts */
@import url('https://fonts.googleapis.com/css?family=Acme|EB+Garamond|Monoton|Patua+One|Roboto|Staatliches&display=swap');
@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
/*
font-family: 'Roboto', sans-serif;
font-family: 'Acme', sans-serif;
font-family: 'Monoton', cursive;
font-family: 'Patua One', cursive;
font-family: 'Staatliches', cursive;
font-family: 'EB Garamond', serif;
*/
</style>
<style>/* Base CSS */
html {
  background: #0c1528;
}

body {
  margin: 0;
  overflow-x: hidden;

}

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fdfdfd;
  display: block;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

html::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: rgba(6, 6, 6, 0)
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
</style>
<style>/* Animations */
@keyframes hide {
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
<style>/* Flex */
.flex {
  display: flex;
}

.flex-center {
  justify-content: center;
}

.flex-left {
  justify-content: left;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-space-around {
  justify-content: space-around;
}

.flex-space-between {
  justify-content: space-between;
}

.flex-align-center {
  align-items: center;
}

.flex-align-top {
  align-items: top;
}

.flex-align-flex-end {
  align-items: flex-end;
}
</style>
<style>
.nav-drawer-title {
  padding: 0px 12px;
  margin-top: 6px;
  margin-bottom: 4px;
  color: #ffffff;
}

.nav-drawer-title h1 {
  padding-left: 1px;
  margin: 16px 0px;
  text-align: left;
  font-size: 22px;
  font-weight: lighter;
}

.spacer {
  padding: 10px 0px;
}

.nav-drawer-title img {
  --size: 50;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
}

.v-toolbar__content img {
  --size: 40;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  margin-right: 2px;
}

.mr-12.align-center span {
  font-size: 18px !important;
  font-weight: bolder;
  font-family: Avenir,Helvetica,Arial,sans-serif !important;
}

.theme--dark.v-application {
  background-color: rgb(0,0,0,0) !important;
  background-size: 100% 100%;
}

.v-navigation-drawer__content {
  background-color: rgb(23, 37, 66);
}

.second-color {
  background-color: rgb(23, 37, 66);
}

div.v-tab {
  width: 100% !important;
  justify-content: left;
  text-transform: capitalize;
}

.v-tabs--vertical .v-tabs-slider-wrapper .v-tabs-slider {
  background-color: rgb(228, 93, 94) !important;
  width: 4px !important;
}

.v-tabs-bar {
  width: 100%;
}

.nav-icon {
  --size: 24;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  margin-right: 24px;
  margin-left: 10px;
}

.v-application .v-subheader.mt-4 {
  opacity: .7;
  margin-top: 20px !important;
  color:#b4bdff !important;
  text-transform: uppercase;
  font-size: 12px;
  font-family: Avenir,Helvetica,Arial,sans-serif;
  height: 20px !important;
}

#alerts {
  position: absolute;
  bottom: 0px;
  width: 100%;
  margin: 10px;
  display: flex;
  justify-content: center;
}

div.v-alert__content {
  display: flex;
  align-items: center !important;
  justify-content: left;
}

.v-progress-circular {
  margin-right: 20px;
}

prepend {
  display: flex;
  align-items: center;
}

.v-app-bar--fixed {
  background-color: rgb(23, 37, 66) !important;
}

.theme--dark.v-tabs-items {
  background-color: rgb(0,0,0,0) !important;
}

/* 1264 */
</style>

<style>
#page-title {
  display: flex;
  padding: 24px 42px;
  align-items: center;
  background: rgba(255, 255, 255, 0);
}

#page-title-text {
  color: white;
  text-align: left;
  margin: 0;
}

.page-title-icon {
  display: block;
  margin-right: 15px;
  width: 32px;
  height: 32px;
  background-size: 100% 100%;
  background-position: center center;
}

.windows {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: top;
}

.window {
  display: block;
  width: 95%;
  max-width: 400px;
  padding: 25px;
  margin: 20px;
  background-color: rgb(23, 37, 66);
}

.window h1 {
  text-align: left;
  margin: 0;
  font-size: 1.5em;
  padding-bottom: 12px;
}

.window h1.paddingless {
  padding-bottom: 0px;
}

</style>

<style>
#big-picture {
  background-image: url('./assets/nav-bar-icons/bigpicture.svg');
}

#top-charts {
  background-image: url('./assets/nav-bar-icons/chart.svg');
}

#library {
  background-image: url('./assets/nav-bar-icons/library.svg');
}
</style>