import { getSocket } from '@/utils/get-socket';

const state = () => ({
  /**
   * Status of user processing
   * 
   * @type {boolean}
   */
  processed: false,

  /**
   * Date last processed
   * 
   * @type {Date}
   */
  lastProcessed: null,
});

const getters = {
  /**
   * Status of user processing
   * 
   * @type {boolean}
   */
  processed: (state) => state.processed,

  /**
   * Date last processed
   * 
   * @type {Date}
   */
  lastProcessed: (state) => state.lastProcessed,
};

const mutations = {
  /**
   * Changes processed status
   * 
   * @param {object} state Vuex state
   * @param {boolean} status Process Status
   */
  SOCKET_SETPROCESSED(state, payload) {
    state.processed = payload.status;
    if (payload.status) {
      state.lastProcessed = payload.lastProcessed;
    }
  },
};

const actions = {
  /**
   * Signals connection to web socket was lost
   * 
   * @param {VuexContext} context Vuex context object 
   */
  process() {
    console.log('process');
    const socket = getSocket();
    socket.emit('process', null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
