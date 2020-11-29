<template>
  <v-app>
    <nav-drawer v-if="loggedIn"/>

    <app-bar />

    <!-- <player v-if="loggedIn"/> -->

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex';

import AppBar from '@/components/ui/app-bar/AppBar';
import NavDrawer from '@/components/ui/nav-drawer/NavDrawer';
// import Player from '@/components/ui/player/Player';

export default {
  name: 'App',
  components: {
    AppBar,
    NavDrawer,
    // Player,
  },
  computed: {
    ...mapGetters('user', [
      'accessToken',
      'loggedIn',
    ]),
  },
  watch: {
    accessToken() {
      if (this.accessToken !== null) {
        this.init();
      }
    },
  },
  created() {
    if (this.$route.name !== 'Callback') {
      this.checkLogin();
    }
  },
  methods: {
    ...mapActions('user', [
      'checkLogin',
    ]),
    ...mapActions('player', [
      'init',
    ]),
  },
};
</script>

<style>
@import url('./style/colors.css');
@import url('./style/base.css');
@import url('./style/typography.css');
@import url('./style/vuetify.css');
</style>
