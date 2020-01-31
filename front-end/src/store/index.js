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
      audioFeatures: {
        valence: {
          average: null,
          distribution: null, 
          history: null,
        },
        danceability: {
          average: null,
          distribution: null, 
          history: null,
        },
        energy: {
          average: null,
          distribution: null, 
          history: null,
        },
        acousticness: {
          average: null,
          distribution: null, 
          history: null,
        },
        instrumentalness: {
          average: null,
          distribution: null, 
          history: null,
        },
        liveness: {
          average: null,
          distribution: null, 
          history: null,
        },
        loudness: {
          average: null,
          distribution: null, 
          history: null,
        },
        speechiness: {
          average: null,
          distribution: null, 
          history: null,
        },
        key: {
          average: null,
          distribution: null, 
          history: null,
        },
        mode: {
          average: null,
          distribution: null, 
          history: null,
        },
        tempo: {
          average: null,
          distribution: null, 
          history: null,
        },
        banger: {
          average: null,
          distribution: null, 
          history: null,
        },
      },
    },
  },
  mutations,
  actions,
})
