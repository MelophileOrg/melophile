import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#FFFFFF',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
        dark1: '#1A1E29',
        dark2: '#272B36',
      },
    },
  },
});
