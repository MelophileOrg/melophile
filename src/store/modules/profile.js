// import axios from 'axios';

const store = {
  namespaced: true,
  state: () => ({
    profile: null,
  }),
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },
  },
  actions: {
  },
};

export default store;
