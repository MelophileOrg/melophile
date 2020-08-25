import Vue from 'vue';
import Vuex from 'vuex';

import connection from './modules/connection';
import profile from './modules/profile';
import search from './modules/search';
import user from './modules/user';

Vue.use(Vuex);

export const modules = {
  connection,
  profile,
  search,
  user,
};

export default new Vuex.Store({
  modules,
});
