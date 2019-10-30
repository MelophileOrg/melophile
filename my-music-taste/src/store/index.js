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
        color: {red: 237, green: 201, blue: 72},
      },
      danceability: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 78, green: 121, blue: 167},
      },
      energy: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 89, green: 161, blue: 79},
      },
      instrumentalness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 255, green: 157, blue: 167},
      },
      liveness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 176, green: 122, blue: 161},
      },
      loudness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 242, green: 142, blue: 43},
      },
      speechiness: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 156, green: 117, blue: 95},
      },
      valence: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [{value: 0, total: 0}],
        color: {red: 242, green: 142, blue: 43},
      },
      tempo: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 225, green: 87, blue: 89},
      },
      banger: {
        value: 0,
        minchart: [],
        maxchart: [],
        plot: [0,0,0,0,0,0,0,0,0,0],
        timeline: [],
        color: {red: 225, green: 87, blue: 89},
      }
    },
    mode: {
      value: 0,
      major: {red: 74, green: 189, blue: 180},
      minor: {red: 180, green: 189, blue: 74},
    },
    dateAdded: [],
    artistAdded: [],
    genreAdded: [],
  },
  actions,
  mutations,
});

export default store