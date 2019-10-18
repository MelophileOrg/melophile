import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token: null,
  },
  mutations: {
    setAccessToken(state, token)
    {
      state.access_token = token;
    }
  },
  actions: {
    parseAccessToken(context)
    {
      if (this.$router.params.access_token != "")
      {
        let token = this.$router.params.access_token
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        context.commit('setAccessToken', token);
      }
    },
    getAccessToken(context)
    {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      const clientId = 'e19f0e8bc1cc4e70bbb6b3e6d34624b9';
      const redirectUri = 'https://musicmood.andrewdanielyoung.com';
      const scopes = [
        'user-read-recently-played',
        'user-top-read',
      ];
      if (!this.state.access_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
      }
    }

  }
})
