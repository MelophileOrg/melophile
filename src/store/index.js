import Vue from 'vue';
import Vuex from 'vuex';

import connection from './modules/connection';
import player from './modules/player';
import user from './modules/user';

Vue.use(Vuex);

export const modules = {
  connection,
  player,
  user,
};

export default new Vuex.Store({
  modules,
});
