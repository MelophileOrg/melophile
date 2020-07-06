import axios from 'axios';

const store = {
  namespaced: true,
  state: () => ({
    user: null,
    error: '',
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    /**
     * Get User
     * Automatically checks if user is logged in.
     */
    async getUser(context) {
      try {
        // Who you
        const response = await axios.get('/api/auth/');
        // Well welcome back :)
        if (response.data.found) {
          context.commit('setUser', response.data.me);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    /**
     * Login
     * Requests a Spotify Login URL.
     */
    async login(context) {
      try {
        let redirect = 'melophile';
        if (process.env.NODE_ENV === 'development') {
          redirect = process.env.NODE_ENV;
        }
        return axios.get(`/api/auth/login/${redirect}`);
      } catch (error) {
        context.commit('setError', 'Spotify seems a bit busy right now. They\'re not responding');
        return null;
      }
    },
    /**
     * Logout
     * Deletes user token.
     */
    logout() {

    },
    /**
     * Callback
     * Takes user code and gets auth token for requests.
     */
    async callback(context, payload) {
      try {
        let redirect = 'melophile';
        if (process.env.NODE_ENV === 'development') {
          redirect = process.env.NODE_ENV;
        }
        const response = await axios.get(`/api/auth/callback/${redirect}/${payload.code}/${payload.state}`);
        console.log(response);
        if (response) {
          context.commit('setUser', response.data);
        }
      } catch (error) {
        context.commit('setError', 'I wasn\'t able to authenticate you! Forgive me :\'(');
      }
    },
  },
};

export default store;
