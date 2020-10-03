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

  /**
   * Processing message
   * 
   * @type {string}
   */
  message: '',

  /**
   * Processing percent complete
   * 
   * @type {number}
   */
  percent: 0,
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

  /**
   * Processing message
   * 
   * @type {string}
   */
  message: (state) => state.message,

  /**
   * Processing percent complete
   * 
   * @type {number}
   */
  percent: (state) => state.percent,
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

  /**
   * Logs current status of process
   * 
   * @param {object} state Vuex state
   * @param {boolean} payload Data from server
   */
  SOCKET_PROCESSINGPROGRESS(state, payload) {
    state.message = payload.message;
    state.percent = payload.percent;
  }
};

const actions = {
  /**
   * Signals connection to web socket was lost
   * 
   * @param {VuexContext} context Vuex context object 
   */
  process() {
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
