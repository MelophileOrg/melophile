<template>
  <v-app id="melophile">
    <v-app-bar app color="dark1" dense>
      <v-row class="limit-width app-bar-row">
        <img id="logo" src="./assets/logo/logo-128.svg" @click="route('/')"/>
        <v-text-field solo dense clearable hide-details prepend-inner-icon="mdi-magnify" placeholder="Search" color="#337180" background-color="#EFEFEF" >
        </v-text-field>
        <v-spacer/>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
          <span>Home</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-chart-areaspline-variant</v-icon>
            </v-btn>
          </template>
          <span>Charts</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-bookshelf</v-icon>
            </v-btn>
          </template>
          <span>Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <span>History</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </template>
          <span>Discover</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" color="#3d97ad">
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </template>
          <span>Notifications</span>
        </v-tooltip>
      </v-row>
    </v-app-bar>

    <v-content class="limit-width">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data: () => ({
    
  }),
  methods: {
    
  },
};
</script>

<style lang="scss">
$maxWidth: 1128px;

.limit-width {
  display: block;
  width: 100%;
  max-width: $maxWidth !important;
  height: 100%;
  margin: 0 auto !important;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

#app {
  padding: 40px;
}

.app-bar-row {
  align-items: center;
}

#logo {
  height: 75%;
  margin-right: 12px;

  &:hover {
    cursor: pointer;
  }
}

.v-input {
  font-size: 15px !important;
}

.v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
  min-height: 32px !important;
  max-width: 300px;
}
</style>