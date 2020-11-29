import api from '@/api';
import { getSocket } from '@/utils/get-socket';
import router from '@/router';

const moduleState = {
  /**
   * User data
   *
   * @type {object}
   */
  user: null,

  /**
   * Access Token
   */
  accessToken: null,
};

const moduleGetters = {
  /**
   * User data
   *
   * @type {object}
   */
  user: (state) => state.user,

  /**
   * Logged in
   *
   * @type {boolean}
   */
  loggedIn: (state) => state.user !== null,

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

  /**
   * Spotify Access Token
   */
  accessToken: (state) => state.accessToken,
};

const moduleMutations = {
  /**
   * Defines current user
   *
   * @param {object} state Vuex state
   * @param {object} user User data
   */
  setUser(state, user) {
    state.user = user;

    let cookie;
    const name = 'melophile-token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        cookie = c.substring(name.length, c.length);
      }
    }

    const socket = getSocket();
    socket.emit('setAccessToken', {
      token: cookie,
    });
  },

  SOCKET_SETACCESSTOKEN(state, token) {
    state.accessToken = token;
  },
};

const moduleActions = {
  /**
   * Checks brower cookies for previous login session tokens
   *
   * @param {VuexContext} context Vuex context object
   */
  async checkLogin({ commit }) {
    try {
      const response = await api.spotify.auth.checkLogin();

      if (response.data.found) {
        commit('setUser', response.data.me);
      }
    } catch (error) {
      commit('setUser', null);
    }
  },

  /**
   * Requests auth URL from server to authenticate with Spotify
   */
  async login() {
    try {
      const response = await api.spotify.auth.login();
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
   * @param {string} payload.code Code to retrieve spotify access token
   * @param {string} payload.state Server state
   */
  async callback({ commit }, payload) {
    try {
      const response = await api.spotify.auth.callback(payload);

      await commit('setUser', response.data);
      router.push('/feed');
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Clears user data and cookie
   *
   * @param {VuexContext} context Vuex context object
   */
  async logout({ commit }) {
    try {
      const response = await api.spotify.auth.logout();
      if (response.status === 200) {
        commit('setUser', null);
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  },
};

const module = {
  namespaced: true,
  state: moduleState,
  getters: moduleGetters,
  mutations: moduleMutations,
  actions: moduleActions,
};

export default module;
