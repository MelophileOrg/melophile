<template>
  <v-app>
    <app-bar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppBar from '@/components/ui/app-bar/app-bar.vue';

export default {
  name: 'App',
  components: {
    AppBar,
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
</style>