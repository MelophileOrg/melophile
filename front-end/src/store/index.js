import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'

import actions from './actions.js';
import mutations from './mutations.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: null,

    progress: {
      total: 0,
      processed: 0,
    },

  },
  mutations,
  actions,
})
