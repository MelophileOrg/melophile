import Vue from 'vue'
import Vuex from 'vuex'

//import axios from 'axios';
var SpotifyWebApi = require('spotify-web-api-js');

import actions from './actions';
import mutations from './mutations';

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
      },
      danceability: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      energy: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      instrumentalness: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      liveness: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      loudness: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      speechiness: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      valence: {
        value: 0,
        minchart: [],
        maxchart: [],
      },
      tempo: {
        value: 0,
        minchart: [],
        maxchart: [],
      }
    },
    dateAdded: [],
    artistAdded: [],
    genreAdded: [],
    audioFeatureAdded: [],
  },
  actions,
  mutations,
});
