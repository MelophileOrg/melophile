<template>
  <v-app :class="$style.component">
    <nav-drawer />

    <app-bar />

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex';
import NavDrawer from '~/components/ui/nav-drawer/nav-drawer';
import AppBar from '~/components/ui/app-bar/app-bar';

export default {
  components: {
    NavDrawer,
    AppBar,
  },
  computed: {
    ...mapState('user', [
      'attemptedLogin',
    ]),
    ...mapGetters('user', [
      'loggedIn',
    ]),
  },
  created() {
    if (!this.loggedIn && !this.attemptedLogin) {
      this.$store.dispatch('user/getUser');
    }
  },
}
</script>

<style module>
.component {
  background-color: var(--bg-1) !important;
}
</style>
