<template>
  <v-app v-resize="onResize" class="melophile">
    <v-navigation-drawer clipped app floating v-model="drawer" :width="210" color="melophile-dark-2">
      <v-btn text style="display: block; margin: 15px auto 10px;" elevation="0" tile v-if="mobile && !user" @click="login">Login with Spotify</v-btn>
      <v-list-item style="margin: 10px 0px 10px;" v-else-if="mobile" inactive>
        <v-list-item-avatar>
          <v-img :src="user.images[0].url"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{user.username}}</v-list-item-title>
          <v-list-item-subtitle @click="logout">Sign out</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="mobile"></v-divider>
      <p class="nav-bar-category" v-if="mobile">Menu</p>
      <v-tabs class="nav-bar-tabs" v-model="tab" @change="route" vertical :grow="true" :show-arrows="false" background-color="melophile-dark-2" slider-color="melophile-green" color="white" :slider-size="4">
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
      <v-spacer></v-spacer>
      <v-btn v-if="!user && !mobile" color="rgba(255, 255, 255, .02)" style="border: 1px solid var(--light-border) !important; background: var(--light-background);" elevation="0" tile @click="login">Login with Spotify</v-btn>
      <v-menu v-else-if="!mobile" :offset-y="true">
        <template v-slot:activator="{ on }">
          <div v-on="on" id="profile-image" :style="{backgroundImage: 'url(' + user.images[0].url + ')'}" />
        </template>
        <v-list color="melophile-dark-3" flat nav tile dense>
          <v-list-item inactive>
            <v-list-item-avatar>
              <v-img :src="user.images[0].url"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{user.username}}</v-list-item-title>
              <v-list-item-subtitle>{{user.followers}} Follower{{checkS(user.followers)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-content>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon v-if="mobile" @click.stop="closeDrawer"/>
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
      {text: "Library", type: "link", route: "library", image: "library"},
      {text: "History", type: "link", route: "history", image: "history"},
      {text: "Social", type: "category"},
      {text: "My Profile", type: "link", route: "myprofile", image: "profile"},
      {text: "Public Profiles", type: "link", route: "publicprofiles", image: "public"},
    ],
    windowSize: {x: 0, y: 0},
    settings: [],
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
    },
    logout() {
      this.$store.dispatch('logout');
    },
    playSongs() {

    },
    autoUpdated() {

    },
    checkS(num) {
      if (num > 1) {
        return "s";
      } else {
        return "";
      }
    }
  }, 
  computed: {
    user() {
      return this.$store.state.user;
    },
    mobile() {
      return (this.windowSize.x < 1264);
    }
  },
  created() {
    this.$store.dispatch('getUser');
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700|Roboto:300,400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css?family=Titillium+Web:300,400&display=swap');
/*
font-family: 'Roboto', sans-serif;
font-family: 'Open Sans', sans-serif;
font-family: 'Titillium Web', sans-serif;
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
  --light-border: rgba(255, 255, 255, 0.212);
  --light-background: rgba(255, 255, 255, 0.02);
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
 
  text-transform: uppercase;
}

.v-btn__content {
  font-family: 'Roboto', sans-serif;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.856) !important;
}


.nav-bar-tabs {
  margin-top: 0px;
}

.nav-bar-tab.v-tab {
  padding-left: 20px;
  justify-content: left;
  align-items: center;
}

p.nav-bar-tab-text {
  display: inline-block;
  font-family: 'Titillium Web', sans-serif;
  font-weight: lighter;
  font-size: .8rem;
  text-align: left;
  text-transform: uppercase;
  margin: 0px 0px 0px 10px !important;
}

p.nav-bar-category {
  text-transform: uppercase;
  font-family: 'Titillium Web', sans-serif;
  color: var(--dark-5);
  font-size: .8rem;
  letter-spacing: 1px;
  margin: 0px 0px 0px 18px !important;
  padding-top: 15px !important;
}

.nav-bar-tab-icon {
  --size: 20;
  display: block;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  margin-right: 8px;
  opacity: .5;
}

#menu-title {
  color:rgba(255, 255, 255, 0.288);
  font-family: 'Titillium Web', sans-serif;
  text-transform: uppercase;
  margin-left: 18px;
  font-weight: lighter;
}

.v-tab--active .nav-bar-tab-icon {
  opacity: 1;
}


#profile-image {
  --size: 32;
  display: block;
  border-radius: 100%;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  background-size: 100% 100%;
  cursor: pointer;
  border: 1px solid var(--light-border);
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

.flex-justify-right {
  justify-content: flex-end;
}

.flex-justify-space-around {
  justify-content: space-around;
}

.flex-justify-space-between {
  justify-content: space-between;
}
</style>