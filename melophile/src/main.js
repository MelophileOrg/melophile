import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false;

const DEV = true;
let SOCKETURI = "http://melophile.org/socket"
if (DEV) SOCKETURI = "http://localhost:3000";

const socket = io(SOCKETURI);

Vue.use(VueSocketIOExt, socket, { store });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
