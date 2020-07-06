import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#049CE5',
        'primary-variant-1': '#29B4F5',
        'primary-variant-2': '#4EC3F8',
        'primary-variant-3': '#80D4F9',
        secondary: '#E54918',
        'secondary-variant-1': '#F34F1C',
        'secondary-variant-2': '#FF7245',
        'secondary-variant-3': '#FF8E69',
        accent: '#5155CA',
        error: '#FF8C64',
        'dark-1': '#161B27',
        'dark-2': '#222B38',
      },
    },
  },
});
