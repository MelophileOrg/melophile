import api from '@/api';

const state = () => ({
  user: null,
});

const getters = {
  user: (state) => state.user,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

const actions = {
  async checkLogin({ commit }) {
    const response = await api.auth.checkLogin();
    if (response.data.found) {
      commit('setUser', response.data.me);
    }
  },
  async login() {
    const response = await api.auth.login();
    console.log(response);
    window.location.href = response;
  },
  async callback(context, payload) {
    const response = await api.auth.callback(payload);
    console.log(response);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
