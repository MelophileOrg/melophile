<template>
  <v-app-bar
    color="grey-2"
    app
    flat
    dark>
    <div class="d-flex align-center justify-space-between limit-width">
      <div
        class="d-flex align-center"
        :class="$style.title"
        @click="home">
        <img src="@/assets/logo/logo.svg" />
      </div>

      <v-text-field 
        v-model="query"
        color="grey-6"
        background-color="grey-3"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        solo
        flat
        dense
        hide-details 
        @keydown="keydown" />

      <v-spacer></v-spacer>

      <v-btn
        v-if="user"
        height="5rem"
        :class="$style.user"
        text
        rounded>
        <div
          :class="$style.image"
          :style="{ backgroundImage: `url('${image}')` }" />

        <v-icon
          v-html="'mdi-chevron-down'"
          color="grey-6" />
      </v-btn>

      <v-btn
        v-if="!user"
        outlined
        @click="login">
        Login with Spotify
      </v-btn>

    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'AppBar',
  computed: {
    ...mapGetters('user', [
      'user',
      'image',
    ]),
    query: {
      get() {
        return this.$store.state.search.query;
      },
      set(value) {
        this.$store.commit('search/setQuery', value);
      },
    },
  },
  methods: {
    ...mapActions('user', [
      'login',
    ]),
    ...mapActions('search', [
      'search',
    ]),
    home() {
      if (this.user) {
        this.$router.push('/feed');
      } else {
        this.$router.push('/');
      }
    },
    keydown(event) {
      if (event.key === 'Enter') {
        this.$router.push(`/search/${this.query}`);
        this.search();
      }
    },
  },
};
</script>

<style module>
.title {
  cursor: pointer;
  margin-right: 1.5rem;
}

.title img {
  height: 3.5rem;
}

.user {
  display: flex;
  align-items: center;
}

.user .image {
  display: block;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-size: 100% auto;
  background-position: center center;
  margin-right: .5rem;
}
</style>
