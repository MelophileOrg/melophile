import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        background: '#FFFFFF',
        primary: '#0047FF',
        accent: '#FE013C',
        title: '#191A1F',
        text: '#747983',

        'grey-10': '#FFFFFF',
        'grey-9': '#f2f3f7',
        'grey-8': '#848B93',
        'grey-7': '#6E6E74',
        'grey-6': '#444D56',
        'grey-5': '#3B434C',
        'grey-4': '#292933',
        'grey-3': '#17191b',
        'grey-2': '#1C1C25',
        'grey-1': '#13131B',

        'warm-6': '#FBC156',
        'warm-5': '#F7A46D',
        'warm-4': '#F79388',
        'warm-3': '#F1839C',
        'warm-2': '#E85AC6',
        'warm-1': '#AB4D7C',

        'purple-6': '#7C37F4',
        'purple-5': '#5F00E7',
        'purple-4': '#5400E2',
        'purple-3': '#3500AE',
        'purple-2': '#2F0098',
        'purple-1': '#220367',
      },
    },
  },
});
