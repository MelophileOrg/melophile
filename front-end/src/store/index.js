import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'

import actions from './actions.js';
import mutations from './mutations.js';

let constants = require('./constants.js');
let audioFeaturesData = constants.audioFeatures;

// let data_collector = require('./data_collector.js');
// let DataCollector = data_collector.class;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    data: {
      userID: null,
      audioFeatures: {
        valence: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        danceability: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        energy: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        acousticness: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        instrumentalness: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        liveness: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        loudness: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        speechiness: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        key: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        mode: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        tempo: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
        banger: {
          average: null,
          distribution: null, 
          history: null,
          min: null,
          max: null,
        },
      },
      analysis: null,
      charts: {
        topPlayed: {
          tracks: [[],[],[]],
          artists: [[],[],[]],
        },
        topSaved: {
          genres: [[],[],[]],
          artists: [[],[],[]],
        },
      },
      list: {
        type: null,
        requestID: null,
        items: {},
      },
    }
    
    
    

  },
  mutations,
  actions,
})
