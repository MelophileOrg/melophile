import api from '@/api';
import { getSocket } from '@/utils/get-socket';
import router from '@/router';

const state = () => ({
  /**
   * User data
   * 
   * @type {object}
   */
  user: null,
});

const getters = {
  /**
   * User data
   * 
   * @type {object}
   */
  user: (state) => state.user,

  /**
   * User image url
   * 
   * @type {string}
   */
  image: (state) => {
    if (state.user) {
      return state.user.images[0].url || null;
    }
  },

  /**
   * User spotify username
   * 
   * @type {string}
   */
  username: (state) => {
    if (state.user) {
      return state.user.username || null;
    }
  },
};

const mutations = {
  /**
   * Defines current user.
   * 
   * @param {object} state Vuex state
   * @param {object} user User data
   */
  setUser(state, user) {
    state.user = user;
    const socket = getSocket();
    socket.emit('setAccessToken', {
      token : window.document.cookie.replace('melophile-token=', ''),
    });
  },
};

const actions = {
  /**
   * Checks brower cookies for previous login session tokens.
   * 
   * @param {VuexContext} context Vuex context object 
   */
  async checkLogin({ commit }) {
    try {
      const response = await api.auth.checkLogin();
      if (response.data.found) {
        commit('setUser', response.data.me);
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Requests auth URL from server to authenticate with Spotify.
   */
  async login() {
    try {
      const response = await api.auth.login();
      window.location.href = response.data;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Called after user returns from authenticating with Spotify
   * 
   * @param {VuexContext} context Vuex context object 
   * @param {object} payload Data returned from Spotify authentication
   * @param {string} payload.code Code to retrieve spotify access token.
   * @param {string} payload.state Server state
   */
  async callback({ commit }, payload) {
    try {
      const response = await api.auth.callback(payload);
      console.log(response.data);
      await commit('setUser', response.data);
      router.push('/feed');
    } catch (error) {
      console.log(error);
    }
  },

  async logout({ commit }) {
    try {
      const response = await api.auth.logout();
      if (response.status === 200) {
        commit('setUser', null);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
