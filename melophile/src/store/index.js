import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';
import constants from './constants.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    constants: constants,
    process: {
      message: "",
      progress: 0,
    }
  },
  mutations,
  actions,
})
