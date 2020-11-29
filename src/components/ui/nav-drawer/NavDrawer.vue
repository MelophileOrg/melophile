<template>
  <v-navigation-drawer
    :class="$style.component"
    width="32rem"
    app
    floating>
    <div
      :class="$style.logo"
      @click="routeHome">
      <img src="../../../assets/logo/logo.svg" />

      <h1 :class="$style.title">
        melophile
      </h1>
    </div>

    <nav-tabs />
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

import NavTabs from './NavTabs';

export default {
  name: 'NavDrawer',
  components: {
    NavTabs,
  },
  computed: {
    ...mapGetters('user', [
      'loggedIn',
    ]),
  },
  methods: {
    routeHome() {
      if (this.loggedIn) {
        this.$router.push('/feed');
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>

<style module>
.logo {
  display: flex;
  align-items: flex-end;
  margin: 2rem 0 1rem;
  justify-content: center;
  cursor: pointer;
}

.logo img {
  --size: 3rem;
  width: var(--size);
  height: var(--size);
  margin-bottom: .2rem;
  margin-bottom: .4rem;
}

.logo h1.title {
  font-size: 1.8rem;
  margin: 0 0 0 .5rem;
  font-weight: 600;
}
</style>
