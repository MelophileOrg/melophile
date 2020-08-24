const state = () => ({
  /**
   * Status of web socket connection
   * 
   * @type {boolean}
   */
  connected: false,
});

const getters = {
  /**
   * Status of web socket connection
   * 
   * @type {boolean}
   */
  connected: (state) => state.connected,
};

const mutations = {
  /**
   * Changes connection status to web socket.
   * 
   * @param {object} state Vuex state
   * @param {string} status Connection Status
   */
  setConnected(state, status) {
    state.connected = status;
  },
};

const actions = {
  /**
   * Signals connection to web socket was found
   * 
   * @param {VuexContext} context Vuex context object 
   */
  connectionMade({ commit }) {
    commit('setConnected', true);
  },

  /**
   * Signals connection to web socket was lost
   * 
   * @param {VuexContext} context Vuex context object 
   */
  connectionLost({ commit }) {
    commit('setConnected', false);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
