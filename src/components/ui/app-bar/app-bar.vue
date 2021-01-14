<template>
  <v-app-bar
    :class="$style.component"
    color="transparent"
    app
    flat>
    <div :class="$style.row">
      <div :class="$style.actions">
        <v-btn
          icon
          @click="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="forward">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <div :class="$style['search-wrapper']">
        <v-text-field
          v-model="query"
          color="white"
          background-color="input-default"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search"
          solo
          flat
          dense
          hide-details
          clearable
          @keydown="search" />
      </div>

      <v-spacer />

      <app-bar-user />
    </div>
  </v-app-bar>
</template>

<script>
import AppBarUser from './components/app-bar-user';

export default {
  name: 'AppBar',
  components: {
    AppBarUser,
  },
  data: () => ({
    query: '',
  }),
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
      console.log(this.$route);
      if (event.key === 'Enter') {
        if (this.$router.name !== 'search'
          || this.$route.params.query !== this.query) {
          this.$router.push(`/search/${this.query}`);
        }
      }
    },
  },
}
</script>

<style lang="scss" module>
.component {
  background-color: var(--bg-3) !important;
}

.component .row {
  display: flex;
  height: 100%;
  margin: 0 auto;
  max-width: var(--max-width);
  width: calc(100% - 2rem);
}

.actions {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 2rem;
}

.search-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  width: 50%;
}
</style>
