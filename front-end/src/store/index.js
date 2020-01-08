import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'

import actions from './actions.js';
import mutations from './mutations.js';

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
      tracks: {
        total: 0,
        processed: 0,
        done: false,
      },
      charts: {
        processed: 0,
        done: false,
      },
      playlists: {
        total: 0,
        processed: 0,
        done: false
      }

    },

  },
  mutations,
  actions,
})
