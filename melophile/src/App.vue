<template>
  <v-app>
    <v-app-bar app dark color="melophile-brand-2">
      <div class="d-flex align-center">
      </div>
      <p>Hello</p>
      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer floating v-model="drawer" :width="210" color="melophile-brand-2">
      <p>Nav Barfffffffffffffffffffffffffffffffffffffffffffff</p>
    </v-navigation-drawer>

    <v-content>

    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({

  }),
};
</script>

<style>
:root {
  --melophile-red: #ff4495;
  --melophile-green: #52e3c2;
  --melophile-blue: #0781ff;
  --melophile-purple: #d211fe;
  --melophile-bright-orange: #ff4b12;
  --melophile-yellow: #ffd900;
  --melophile-orange: #ed8a19;
  --melophile-light-blue: #40c4ff;
  --melophile-gray: #546e7a;
  --melophile-brand-0: #1a1a21;
  --melophile-brand-1: #282833;
  --melophile-brand-2: #32323e;
  --melophile-brand-3: #393945;
  --melophile-brand-4: #40424f;
  --melophile-brand-5: #4d505f;
  --melophile-brand-6: #6e7288;
  --melophile-brand-7: #8f94ab;
  --melophile-brand-8: #b4b8cd;
  --melophile-contrast: #fff;
}

.v-application {
  background: var(--melophile-brand-1) !important;
}
</style>
