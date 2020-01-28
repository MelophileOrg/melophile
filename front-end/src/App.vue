<template>
  <v-app v-resize="onResize" id="app">
    <v-app-bar app clipped-left hide-on-scroll v-if="windowSize.x < 1264">
      <v-toolbar-title class="mr-12 align-center">
        <h1 id="title">melophile</h1>
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="windowSize.x < 1264"/>
    </v-app-bar>
    <v-navigation-drawer fixed class="nav-bar" app floating clipped v-model="drawer" :width="210" color="rgb(255,255,255)" >
      <h1 id="title" class="large" v-if="windowSize.x > 1264">melophile</h1>
      <h1 id="title" class="large" v-else>menu</h1>
      <v-tabs v-model="tab" @change="route" vertical background-color="rgba(0,0,0,0)" :grow="true" class="extra-margin">
        <div class="nav-tabs" v-for="(tab, index) in tabs" :key="'nav-bar-tab-' + tab.title + index">
          <v-tab class="lowercase" v-if="tab.type == 'link'">
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
        :value="progress.percent != 0 && progress.percent != 1">
          <v-progress-circular color="rgb(255,255,255)" :size="20" :value="progress.percent * 100" />
          {{progress.message}}
        </v-alert>
        <v-alert :width="alertWidth()" border="left" dense dismissible :elevation="5" type="success" transition="scale-transition" :value="progress.percent == 1">Finished Analysizing Library</v-alert>
        <v-alert :width="alertWidth()" border="left" dense dismissible :elevation="5" type="error" transition="scale-transition" :value="false">Error with Loading Library</v-alert>
      </div>
      <div class="footer flex flex-space-between" style="margin: 0 10px">
        <p>@2020 Andrew Young</p>
        <div class="flex flex-right">
          <a >Upcoming Features</a>
          <a href="https://www.patreon.com/andrewyoung">Support on Patreon</a>
        </div>
      </div>
    </v-content>
    
  </v-app>
</template>

<script>
  export default {
    name: "app",
    data: () => ({
      drawer: true,
      tab: 0,
      tabs: [
        {type: 'link', title: 'Home', img: 'home', path: '/'},
        {type: 'link', title: 'Search', img: 'search', path: '/search'},
        {type: 'link', title: 'Discover', img: 'discover', path: '/discover'},
        {type: 'subheader', title: 'Your Library'},
        {type: 'link', title: 'Overview', img: 'bigpicture', path: '/library/analysis'},
        {type: 'link', title: 'Charts', img: 'chart', path: '/charts'},
        {type: 'link', title: 'History', img: 'history', path: '/history'},
        {type: 'link', title: 'Library', img: 'library', path: '/library'},
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
        if (routes[index] == this.$route.fullPath){
          if (this.windowSize.x < 1264)
            this.drawer = false;
          return;
        }
        if (this.first) {
          this.first = false;
        }
        this.$router.push(routes[index]);
        window.scroll({
          top: 0,
          behavior: 'auto'
        });
        if (this.windowSize.x < 1264)
          this.drawer = false;
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
      },
    },
    computed: {
      progress() {
        return this.$store.state.progress;
      },
      storeRoute() {
        return this.$store.state.route;
      }
    },
    watch: {
      storeRoute: function() {
        switch(this.storeRoute) {
          case "home":
            this.tab = 0;
            break;
          case "search":
            this.tab = 1;
            break;
          case "discover":
            this.tab = 2;
            break;
          case "analysis":
            this.tab = 4;
            break;
          case "charts":
            this.tab = 5;
            break;
          case "history":
            this.tab = 6;
            break;
          case "library":
            this.tab = 7;
            break;
          case "myprofile":
            this.tab = 9;
            break;
          case "publicprofiles":
            this.tab = 10;
            break;
          default: 
            this.tab = 0;
            break;
        }
      },
    },
    async created () {
      await this.onResize();

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
@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto:100&display=swap');
</style>
<style>/* Base CSS */
.lowercase {
  text-transform: lowercase !important;
}
html {
  background: #32323e;
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

.v-content__wrap {
  position: relative;
  min-height: 100vh;
  padding-bottom: 150px;
}

.content-padding {
  padding-left: 16px;
  padding-right: 16px;
}

.pop-small {
    -webkit-box-shadow: 0 4px 15px rgba(40,40,51,.6);
    box-shadow: 0 4px 15px rgba(40,40,51,.6);
}
</style>
<style> /* Fixes */
#title {
  font-family: 'Roboto', sans-serif !important;
  color: rgb(251, 251, 251);
  font-size: 1.4em !important;
  font-weight: lighter !important;
}

#title.large{
  font-size: 1.9em !important;
  text-align: left;
  margin-left: 26px;
  margin-top: 20px;
}

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
  margin-right: 10px;
}

.v-toolbar__content img {
  --size: 35;
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
  background-color: #32323e;
}

.small-elevation {
  box-shadow: 0 4px 15px rgba(40,40,51,.6) !important;
}

.v-navigation-drawer__border {
  background-color: rgba(0, 0, 0, 0) !important;
  width: 0px !important;
}

.second-color {
  background-color: #32323e;
}


.nav-icon {
  --size: 20;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  margin-right: 15px;
  margin-left: 10px;
}

.v-toolbar {
  -webkit-box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0), 0px 4px 5px 0px rgba(0, 0, 0, 0), 0px 1px 10px 0px rgba(0, 0, 0, 0) !important;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0), 0px 4px 5px 0px rgba(0, 0, 0, 0), 0px 1px 10px 0px rgba(0, 0, 0, 0) !important;
}



.v-application .v-subheader.mt-4 {
  opacity: .3;
  margin-top: 20px !important;
  margin-left: 10px;
  color:#ffffff !important;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bolder !important;
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

.v-app-bar--fixed {
  background-color: rgba(50, 50, 62, .9) !important;
}

.theme--dark.v-tabs-items {
  background-color: rgba(0, 0, 0, 0) !important;
}

.extra-margin {
  margin-top: 10px;
}

@media only screen and (min-width: 1264px) {
  .extra-margin {
    margin-top: 10px;
  }

  .v-content__wrap {
    padding-left: 15px !important;
  }
}

.v-tabs--vertical div.v-tab {
  width: 100% !important;
  justify-content: left;
  text-transform: capitalize;
}

.v-tabs--vertical .v-tabs-slider-wrapper .v-tabs-slider {
  background-color: #52e3c2 !important;
  width: 4px !important;
}

.v-tabs--vertical .v-tabs-bar {
  width: 100%;
}
.v-tabs--vertical .v-tabs-bar {
  margin-top: 0px !important;
}


/* 1264 */
</style>
<style scoped>

</style>
<style> /* Old WINDOWS */
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
<style> /* Images */
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

@keyframes emptylist {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes background-cycle {
  0% {
    background-position: -100% -100% !important;
  }
  100% {
    background-position: 100% 100% !important;
  }
}

.slide-up {
  --delay: 0;
  --speed: .3;
  animation: hide calc(var(--delay) * .1s), slide-up .3s ease calc(var(--delay) * .1s);
}

.fade-in {
  --delay: 0;
  animation: hide calc(var(--delay) * .1s), fade-in .3s ease calc(var(--delay) * .1s);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
<style>/* Flex */
.footer {
  display: block;
  width: 95%;
  margin: 0 auto;
  position: absolute;
  bottom: 20px;
}
.flex {
  display: flex;
}

.flex-center {
  justify-content: center;
}

.flex-left {
  justify-content: left;
}

.flex-right {
  justify-content: flex-end;
}

p {
  color: rgba(204, 204, 204, 0.267);
  margin: 0 10px;
}

.v-application a {
  text-transform: none;
  color: rgba(204, 204, 204, 0.267) !important;
  margin: 0 10px;
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