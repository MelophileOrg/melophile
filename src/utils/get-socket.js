import Vue from 'vue';

import Socket from '@/utils/socket/';
import store from '@/store/index';

let socket;

/**
 * Establishes connection with web socket and
 * attaches it to the vue instance.
 */
export const connectWS = () => {
  const url = 'ws://localhost:4001';

  socket = new Socket(url, store, connectWS);

  Vue.prototype.$socket = socket;

  socket.init();
};

/**
 * Returns a reference to the socket.
 * 
 * @type {Socket}
 */
export const getSocket = () => socket;
