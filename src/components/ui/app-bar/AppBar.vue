<template>
  <v-app-bar
    color="transparent"
    :class="$style.component"
    :fixed="true"
    app
    flat>
    <div
      v-if="loggedIn"
      class="d-flex align-center">
      <v-btn
        icon
        @click="back">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn
        icon
        @click="forward">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-btn
        icon
        @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <div
      v-else
      class="d-flex align-center">
      <div
        :class="$style.logo"
        @click="routeHome">
        <img src="../../../assets/logo/logo.svg" />

        <h1 :class="$style.title">
          melophile
        </h1>
      </div>
    </div>

    <div
      v-if="loggedIn"
      :class="$style['search-wrapper']">
      <v-text-field
        v-model="query"
        color="grey-4"
        background-color="grey-9"
        append-icon="mdi-magnify"
        placeholder="Search"
        filled
        rounded
        dense
        hide-details
        clearable
        @keydown="search" />
    </div>

    <v-spacer />

    <current-user />
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

import CurrentUser from './CurrentUser';

export default {
  name: 'AppBar',
  components: {
    CurrentUser,
  },
  data: () => ({
    query: '',
  }),
  computed: {
    ...mapGetters('user', [
      'loggedIn',
    ]),
  },
  methods: {
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    },
    refresh() {
      window.location.reload(false);
    },
    search(event) {
      if (event.key === 'Enter') {
        if (this.$router.name !== 'Search'
          || this.$route.params.query !== this.query) {
          this.$router.push(`/search/${this.query}`);
        }
      }
    },
    routeHome() {
      this.$router.push('/feed');
    },
  },
};
</script>

<style module>
.component {
}

.search-wrapper {
  width: 30%;
  max-width: 5000rem;
}

.logo {
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  margin-left: 1rem;
  padding-left: 3.4rem;
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
