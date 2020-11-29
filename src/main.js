import Vue from 'vue';

import { connectWS } from '@/utils/get-socket.js';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

const config = () => {
  connectWS();
};

config();
