import { storeModules } from '@/store';
import { ModuleTree } from 'vuex';

const getMsgName = ({ namespace, isNamespaced }, msgName) => {
  return isNamespaced ? `${namespace}/${msgName}` : msgName;
};

const getSocketFunctionsFromStore = () => {
  const socketMappings: { [key: string]: { [key: string]: any } } = {};

  Object.entries(storeModules)
    .forEach(([storeNamespace, storeModuleData]) => {
      const { namespaced: isNamespaced, mutations, actions } = storeModuleData as ModuleTree<any>;
      const setSocketFunctions = (functionType, storeFunctionData) => {
        if (!storeFunctionData) {
          return;
        }
        Object.values(storeFunctionData)
          .map((storeFunction) => storeFunction.name)
          .filter(socketEventName => socketEventName.startsWith('SOCKET_'))
          .forEach(socketEventName => {
            const defaultSocketData = {
              mutations: [],
              actions: [],
            };
            socketMappings[socketEventName] = {
              ...defaultSocketData,
              ...socketMappings[socketEventName],
            };
            socketMappings[socketEventName][functionType]
              .push({ namespace: storeNamespace, isNamespaced });
          });
      };
      setSocketFunctions('mutations', mutations);
      setSocketFunctions('actions', actions);
    });
  return socketMappings;
};

function Socket(url, store, connectWS) {
  this.url = url;
  this.store = store;
  this.connectWS = connectWS;
  this.socket = new WebSocket(this.url);
  this.isAppReady = false;
}

Socket.prototype = {
  async emit(action, data) {
    const windowId = window.context.user.windowId || navigator.userAgent + Math.random();
    this.socket.send(JSON.stringify({ action, data, windowId }));
  },

  init() {
    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onmessage = this.onMessage;
    this.socket.onerror = this.onError;
  },

  onOpen() {
    this.store.dispatch('conn/wsConnected', true);
  },

  onClose() {
    this.store.dispatch('conn/wsConnected', false);
    setTimeout(this.connectWS, 1000);
  },

  async onMessage(event) {
    const message: any = this.getMessageData(event.data);
    if (!message) {
      return;
    }
    if (!this.isAppReady) {
      await this.waitForAppReady(message);
      this.isAppReady = true;
    }
    this.sendMessageToStore(message.mutation.toUpperCase(), message.data);
  },

  onError(error) {
    console.log(error);
  },

  getMessageData(message) {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      log.error(err);
    }
    if (!parsedMessage || !parsedMessage.mutation) {
      log.io('unrecognizable socket message', message);
      return;
    }
    return parsedMessage;
  },

  sendMessageToStore(msg, msgData) {
    const msgName = `SOCKET_${msg}`;
    const configObj = socketFunctions[msgName];
    if (!configObj) {
      return;
    }
    this.sendActionMessages(configObj, msgName, msgData);
    this.sendMutationMessages(configObj, msgName, msgData);
  },

  sendActionMessages(configObj, msgName, msgData) {
    if (!configObj.actions.length) {
      return;
    }
    const actionsPromises = configObj.actions.map((action: ISocketMessage) =>
      this.store.dispatch(getMsgName(action, msgName), msgData));
    Promise.all(actionsPromises).catch(err => log.error(`Could not send action message '${msgName}'`, err));
  },

  sendMutationMessages(configObj, msgName, msgData) {
    if (!configObj.mutations.length) {
      return;
    }
    configObj.mutations.forEach((mutation: ISocketMessage) => {
      this.store.commit(getMsgName(mutation, msgName), msgData);
    });
  },

  async waitForAppReady(data) {
    if (!['user_connected', 'banned', 'maintenance'].includes(data.mutation)) {
      await this.waitForConnection();
    }
  },
};

export default Socket;