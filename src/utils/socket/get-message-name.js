/**
 * Creates string to direct vuex to the correct action
 * in the correct module.
 * 
 * @param {object} options Namespace options
 * @param {boolean} options.namespace namespace of target module.
 * @param {boolean} options.isNamespaced Whether target module is namespaced
 * @param {string} messageName Desired action
 */
export const getMessageName = ({ namespace, isNamespaced }, messageName) => {
  return isNamespaced ? `${namespace}/${messageName}` : messageName;
};
