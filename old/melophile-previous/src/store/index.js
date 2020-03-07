import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';

let constants = require('./constants.js');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    route: "home",
    state: {
      loggingIn: false,
      processing: false,
    },
    authentication: {
      accessToken: null,
      refreshToken: null,
      state: null,
    },
    progress: {
      message: "",
      percent: 0,
      done: false,
    },
    constants: {
      audioFeaturesData: constants.audioFeatures,
    },
    requestID: 0,
    stats: null,
    audioFeatures: null,
    history: null,
    
  },
  mutations,
  actions,
})
