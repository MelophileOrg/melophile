import Vue from 'vue';
import Vuex from 'vuex';

import connection from './modules/connection';
import search from './modules/search';
import user from './modules/user';


Vue.use(Vuex);

export const modules = {
  connection,
  search,
  user,
};

export default new Vuex.Store({
  modules,
});
