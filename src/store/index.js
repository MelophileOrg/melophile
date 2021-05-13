import Vue from 'vue';
import Vuex from 'vuex';

import connection from './modules/connection';
import process from './modules/process';
import search from './modules/search';
import user from './modules/user';
import cache from './modules/cache';

Vue.use(Vuex);

export const modules = {
  connection,
  process,
  search,
  user,
  cache,
};

export default new Vuex.Store({
  modules,
});
