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

      <user-icon />

    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserIcon from '@/components/ui/app-bar/user-icon.vue';

export default {
  name: 'AppBar',
  components: {
    UserIcon,
  },
  computed: {
    ...mapGetters('user', [
      'user',
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
        if (this.$router.name !== 'Search' ||
          this.$route.params.query !== this.query) {
          this.$router.push(`/search/${this.query}`);
        }
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
</style>
