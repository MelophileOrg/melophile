import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import profile from './modules/profile';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    profile,
  },
});
