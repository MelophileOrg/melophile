import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        dark: {
          primary: '#ffffff',
          secondary: '#000000',
          accent: '#ff78cb',
          error: '#b71c1c',
        }
      }
    },
    icons: {
      iconfont: 'fa',
    },
});