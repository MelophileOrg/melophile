import axios from 'axios';

const defaultState = () => ({
  /**
   * Has automatic login been attempted
   * 
   * @type {boolean}
   */
  attemptedLogin: false,

  /**
   * User object
   *
   * @type {object}
   */
  user: null,

  /**
   * Profile object
   * 
   * @type {object}
   */
  profile: null,
});

export const state = defaultState;

export const getters = {
  loggedIn: state => state.user !== null,
  image: state => {
    if (state.profile) {
      return state.profile.images[0].url;
    }
    return '';
  },
  username: state => {
    if (state.profile) {
      return state.profile.username;
    }
    return '';
  },
  id: state => {
    if (state.user) {
      return state.user.spotify.id;
    }
    return null;
  },
}

export const mutations = {
  /**
   * Marks an attempted login from cookie
   */
  attemptedLogin(state) {
    state.attemptedLogin = true;
  },

  /**
   * Define current user
   *
   * @param {object} user User object
   */
  setUser(state, user) {
    state.user = user
  },

  /**
   * Define current user's profile
   *
   * @param {object} profile Profile object
   */
  setProfile(state, profile) {
    state.profile = profile
  },

  /**
   * Removes all data and resets state
   */
  resetState(state) {
    Object.assign(state, defaultState());
  },
}

export const actions = {
  /**
   * Attempts to login using browser cookie
   */
  getUser: async ({ commit }) => {
    const {
      data,
    } = await axios.get('/api/auth');

    if (data.found) {
      const {
        user,
        profile,
      } = data;

      await commit('setUser', user);
      await commit('setProfile', profile);
    }

    commit('attemptedLogin');
  },

  /**
   * Requests auth link from Spotify to authenticate
  */
  login: async () => {
    const {
      data,
    } = await axios.get('/api/auth/login/melophile');

    window.location.replace(data);
  },

  /**
   * Retrieves user's access token from Spotify API
   * 
   * @param {string} payload.code Authorization code to be exchanged for access token
   * @param {string} payload.state Server state
   */
  callback: async ({ commit }, { code, state }) => {
    const {
      data,
    } = await axios.post(`/api/auth/callback/melophile/${code}/${state}`);
    
    const {
      user,
      profile,
    } = data;

    await commit('setUser', user);
    await commit('setProfile', profile);
  },

  /**
   * Clears user data and auth cookie
   */
  logout: async ({ commit }) => {
    await axios.delete('/api/auth');
    commit('resetState');
  },
}
