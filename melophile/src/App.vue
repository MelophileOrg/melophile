<template>
  <v-app class="melophile">
    <v-navigation-drawer clipped app floating v-model="drawer" :width="210" color="melophile-dark-2">
      <v-tabs v-model="tab" @change="route" vertical :grow="true" :show-arrows="false">
      </v-tabs>
    </v-navigation-drawer>
    <v-app-bar app dark clipped-left color="melophile-dark-2">
      <div class="flex flex-align-center title">
        <div class="title-m"/>
        <p class="title-continue">elophile</p>
      </div>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-app-bar-nav-icon @click.stop="closeDrawer" />
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  data: () => ({
    tab: 0,
    drawer: true,
  }),
  methods: {
    closeDrawer() {
      this.drawer = !this.drawer;
    },
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
  background: var(--dark-1) !important;
}

.title {
  cursor: pointer;
}

.title-m {
  display: block;
  width: 40px;
  height: 40px;
  background-image: url('./assets/general/logo-white-100.svg');
  background-size: 100% 100%;
}

p.title-continue {
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  margin: 0px;
  margin-left: 3px;
  font-size: 1.3rem;
  text-transform: uppercase;
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
