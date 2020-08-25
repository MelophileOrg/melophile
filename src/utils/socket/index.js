import { getMessageName } from './get-message-name';
import { socketFunctions } from './get-socket-functions';

/**
 * Establishes and maintains connection with
 * web socket, connecting it to Vuex
 * 
 * @param {string} url Web socket url
 * @param {Vuex} store Vuex store
 * @param {function} connectWS Function for reconnecting if lost
 */
function Socket(url, store, connectWS) {
  this.url = url;
  this.store = store;
  this.connectWS = connectWS;
  this.socket = new WebSocket(this.url);
  this.isAppReady = false;
}

Socket.prototype = {
  /**
   * Emits message and data to web socket
   * 
   * @param {string} action Action name (directs to correct endpoint)
   * @param {*} data Payload to be sent
   */
  async emit(action, data) {
    this.socket.send(JSON.stringify({ action, data }));
  },

  /**
   * Esablishes on event methods
   */
  init() {
    this.socket.onopen = () => {
      this.onOpen();
    };
    this.socket.onclose = () => {
      this.onClose();
    };
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
    this.socket.onerror = () => {
      this.onError();
    };
  },

  /**
   * Logs connection made with Vuex.
   */
  onOpen() {
    this.store.dispatch('connection/connectionMade');
  },

  /**
   * Logs connection lost with Vuex and attempts
   * to re-establish.
   */
  onClose() {
    this.store.dispatch('connection/connectionLost');
    setTimeout(this.connectWS, 5000);
  },

  /**
   * Recieves message from server and routes to Vuex.
   * 
   * @param {*} event Web socket event
   */
  async onMessage(event) {
    const message = this.getMessageData(event.data);
    if (!message) {
      return;
    }
    if (!this.isAppReady) {
      this.isAppReady = true;
    }
    this.sendMessageToStore(message.mutation.toUpperCase(), message.data);
  },

  /**
   * Logs error
   * 
   * @param {Error} error
   */
  onError(error) {
    console.log(error);
  },

  /**
   * Converts message into readable data.
   * 
   * @param {JSON} message 
   */
  getMessageData(message) {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      console.log(err);
    }
    if (!parsedMessage || !parsedMessage.mutation) {
      console.log('unrecognizable socket message', message);
      return;
    }
    return parsedMessage;
  },

  /**
   * Re-routes event to correct Vuex functions.
   * 
   * @param {string} message Event name
   * @param {*} payload Data accompanying message
   */
  sendMessageToStore(message, payload) {
    const messageName = `SOCKET_${message}`;
    const configObj = socketFunctions[messageName];
    if (!configObj) {
      return;
    }
    this.sendActionMessages(configObj, messageName, payload);
    this.sendMutationMessages(configObj, messageName, payload);
  },

  /**
   * Re-routes event to correct Vuex Action.
   * 
   * @param {*} configObj Mapped function
   * @param {string} message Event name
   * @param {*} payload Data accompanying message
   */
  sendActionMessages(configObj, messageName, payload) {
    if (!configObj.actions.length) {
      return;
    }
    const actionsPromises = configObj.actions.map((action) =>
      this.store.dispatch(getMessageName(action, messageName), payload));
    Promise.all(actionsPromises).catch(err => console.log(`Could not send action message '${messageName}'`, err));
  },

  /**
   * Re-routes event to correct Vuex Mutation.
   * 
   * @param {*} configObj Mapped function
   * @param {string} message Event name
   * @param {*} payload Data accompanying message
   */
  sendMutationMessages(configObj, messageName, payload) {
    if (!configObj.mutations.length) {
      return;
    }
    configObj.mutations.forEach((mutation) => {
      this.store.commit(getMessageName(mutation, messageName), payload);
    });
  },
};

export default Socket;