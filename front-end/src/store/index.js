import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';

let constants = require('./constants.js');
let audioFeaturesData = constants.audioFeatures;

let jimmy = require('./jimmy.js');
let Jimmy = jimmy.import;

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
      list: {
        type: 0,
        list: [],
        tracks: {},
        albums: {},
        artists: {},
        playlists: {},
      },
    }
    
    
    

  },
  getters: {
    tracks: state => state.data.list.tracks,
    albums: state => state.data.list.albums,
    artists: state => state.data.list.artists,
    playlists: state => state.data.list.playlists,
  },
  mutations,
  actions,
})
