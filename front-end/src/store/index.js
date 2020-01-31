import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';

import Jimmy from './jimmy.js';

let constants = require('./constants.js');
let audioFeaturesData = constants.audioFeatures;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    route: "home",
    
    authentication: {
      accessToken: null,
      refreshToken: null,
      state: null,
    },
    progress: {
      message: "MESSAGE",
      percent: 0,
      done: false,
    },
    constants: {
      audioFeaturesData: audioFeaturesData,
    },
    
    jimmy: new Jimmy(),

    data: {
      userID: null,
      
    },
  },
  mutations,
  actions,
})
