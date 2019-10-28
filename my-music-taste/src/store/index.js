import Vue from 'vue'
import Vuex from 'vuex'

//import axios from 'axios';
var SpotifyWebApi = require('spotify-web-api-js');

import actions from './actions.js';
import mutations from './mutations.js';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    dev: true, 

    spotifyApi: new SpotifyWebApi(),
    inicialized: false,
    user: null,
    
    profileData: null,
    publicProfiles: null,

    tracks: {},
    artists: {},
    genres: {},

    progress: {
      total: 0,
      processed: 0,
      tracksLoaded: false,
      artistsLoaded: false,
      genresLoaded: false,
    },

    topPlayed: {
      tracks: [[],[],[]],
      artists: [[],[],[]],
    },
    topSaved: {
      artists: [],
      genres: [],
    },
    audioFeatures: {
      acousticness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      danceability: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      energy: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      instrumentalness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      liveness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      loudness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      speechiness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      valence: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      tempo: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      },
      banger: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
      }
    },
    dateAdded: [],
    artistAdded: [],
    genreAdded: [],
  },
  actions,
  mutations,
});

export default store