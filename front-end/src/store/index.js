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
    },

    list: {
      type: 0, // 0: Tracks, 1: Artists, 2: Albums, 3: Playlists
      list: [],
      tracks: {
        Penis: "fuck"
      },
      albums: {},
      artists: {},
      playlists: {},
    },
  },
  mutations,
  actions,
})
