<template>
  <v-app>
    <app-bar />

    <v-main>
      <router-view />
    </v-main>

    <snackbars />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppBar from '@/components/ui/app-bar/app-bar.vue';
import Snackbars from '@/components/ui/snackbars/snackbars.vue';

export default {
  name: 'App',
  components: {
    AppBar,
    Snackbars,
  },
  computed: {
    ...mapGetters('connection', [
      'connected',
    ]),
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
  },
};
</script>

<style>
@import url('./style/global/colors.css');
@import url('./style/global/base.css');
@import url('./style/global/typography.css');
@import url('./style/global/vuetify.css');
</style>