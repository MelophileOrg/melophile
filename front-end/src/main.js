import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3002',
  vuex: {
      store,
      actionPrefix: "server_",
      mutationPrefix: "server_",
      options: {
        useConnectionNamespace: true
      }
  },
  options: { path: "" }
}))

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3002/auth',
  vuex: {
      store,
      actionPrefix: "server_auth_",
      mutationPrefix: "server_auth_",
      options: {
        useConnectionNamespace: true
      }
  },
  options: { path: "" }
}))



//Vue.$socket.mynamespace.emit('emit_method', data)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
