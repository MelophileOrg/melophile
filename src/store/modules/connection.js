const moduleState = {
  /**
   * Status of web socket connection
   *
   * @type {boolean}
   */
  connected: false,
};

const moduleGetters = {
  /**
   * Status of web socket connection
   *
   * @type {boolean}
   */
  connected: (state) => state.connected,
};

const moduleMutations = {
  /**
   * Changes connection status to web socket.
   *
   * @param {object} state Vuex state
   * @param {string} status Connection Status
   */
  setConnected(state, status) {
    state.connected = status;
  },

  /**
   * Verifies Connection
   */
  SOCKET_PONG(state, data) {
    console.log(data);
  },
};

const moduleActions = {
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

const module = {
  namespaced: true,
  state: moduleState,
  getters: moduleGetters,
  mutations: moduleMutations,
  actions: moduleActions,
};

export default module;
