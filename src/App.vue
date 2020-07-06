<template>
  <v-app :style="{background: $vuetify.theme.themes.dark.dark2}">
    <app-bar/>
    <v-main color="dark2">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/application/AppBar.vue';

export default {
  name: 'App',
  components: {
    AppBar,
  },
  data: () => ({

  }),
};
</script>

<style lang="css">
@import "./components/global/base.css";
@import "./components/global/typography.css";
@import "./components/global/colors.css";
</style>
