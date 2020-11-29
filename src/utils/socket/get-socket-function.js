import { modules } from '@/store/index';

/**
 * Retrieves all socket related functions
 * from vuex.
 *
 * @returns {object} Socket Functions
 */
const getSocketFunctionsFromStore = () => {
  const socketMappings = {};

  Object.entries(modules)
    .forEach(([storeNamespace, storeModuleData]) => {
      const { namespaced: isNamespaced, mutations, actions } = storeModuleData;

      const setSocketFunctions = (functionType, storeFunctionData) => {
        if (!storeFunctionData) {
          return;
        }
        Object.values(storeFunctionData)
          .map((storeFunction) => storeFunction.name)
          .filter((socketEventName) => socketEventName.startsWith('SOCKET_'))
          .forEach((socketEventName) => {
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

export const socketFunctions = getSocketFunctionsFromStore();
