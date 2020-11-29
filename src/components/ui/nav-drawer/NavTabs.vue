<template>
  <v-tabs
    v-model="tab"
    slider-size="6"
    vertical>

    <v-tab>
      <v-icon>mdi-home-outline</v-icon>
      feed
    </v-tab>

    <v-tab>
      <v-icon>mdi-heart-outline</v-icon>
      browse
    </v-tab>

    <v-tab>
      <v-icon>mdi-access-point</v-icon>
      radio
    </v-tab>

    <v-subheader>
      personalized
    </v-subheader>

    <v-tab>
      <v-icon>mdi-poll</v-icon>
      my charts
    </v-tab>

    <v-tab>
      <v-icon>mdi-calendar-blank-outline</v-icon>
      history
    </v-tab>

    <v-subheader>
      library
    </v-subheader>

    <v-tab>
      <v-icon>mdi-music-note-eighth</v-icon>
      tracks
    </v-tab>

    <v-tab>
      <v-icon>mdi-album</v-icon>
      albums
    </v-tab>

    <v-tab>
      <v-icon>mdi-account-outline</v-icon>
      artists
    </v-tab>

    <v-tab>
      <v-icon>mdi-music-box-multiple-outline</v-icon>
      playlists
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'NavTabs',
  data: () => ({
    tab: 0,
    tabs: [
      {
        name: 'feed',
        route: '/feed',
        icon: 'mdi-home-outline',
      },
      {
        name: 'browse',
        route: '/browse',
        icon: 'mdi-heart-outline',
      },
      {
        name: 'radio',
        route: '/radio',
        icon: 'mdi-access-point',
      },
      {
        name: 'my charts',
        route: '/charts/me',
        icon: 'mdi-poll',
      },
      {
        name: 'history',
        route: '/history',
        icon: 'mdi-calendar-blank-outline',
      },
      {
        name: 'tracks',
        route: '/library/tracks',
        icon: 'mdi-music-note-eighth',
      },
      {
        name: 'artists',
        route: '/library/artists',
        icon: 'mdi-account-outline',
      },
      {
        name: 'albums',
        route: '/library/albums',
        icon: 'mdi-album',
      },
      {
        name: 'playlists',
        route: '/library/playlists',
        icon: 'mdi-music-box-multiple-outline',
      },
    ],
  }),
  watch: {
    tab() {
      if (this.$route.name !== this.tabs[this.tab].name) {
        this.$router.push(this.tabs[this.tab].route);
      }
    },
  },
};
</script>

<style>
.v-tab {
  opacity: .75;
}

.v-tab.v-tab--active {
  opacity: 1;
}
</style>
