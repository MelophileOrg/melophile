<template>
  <v-app>
    <app-bar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import AppBar from '@/components/ui/app-bar/app-bar.vue';

export default {
  name: 'App',
  components: {
    AppBar,
  },
  methods: {
    ...mapActions('user', [
      'checkLogin',
    ]),
  },
  created() {
    this.checkLogin();
  },
};
</script>

<style>
@import url('./style/global/colors.css');
@import url('./style/global/base.css');
@import url('./style/global/typography.css');
</style>