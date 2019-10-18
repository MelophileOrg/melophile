import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token: null,
    spotifyWebApi: null,

    apps: [
      {
        title: "Song Analysis",
        path: "songanalysis",
        auth: false,
        description: [
          "View all available information Spotify offers on a given song.",
        ],
        img: "search"
      },
      {
        title: "My Charts",
        path: "mycharts",
        auth: true,
        description: [
          "View your personalized top charts and artists.",
        ],
        img: "chart"
      },
      {
        title: "Library Analysis",
        path: "libraryanalysis",
        auth: true,
        description: [
          "Discover the averages and extremes within your library.",
        ],
        img: "library"
      },
      {
        title: "My Music Mood",
        path: "mymusicmood",
        auth: true,
        description: [
          "What does your music say about you?",
        ],
        img: "musicmood"
      }
    ],
    index: 0,
  },
  mutations: {
    setAccessToken(state, token)
    {
      state.access_token = token;
    },
    setSpotifyWebApi(state) 
    {
      state.spotifyWebApi = new SpotifyWebApi();
      state.spotifyWebApi.setAccessToken(state.access_token);
    },
    setIndex(state, index) {
      state.index = index;
    }
  },
  actions: {
    parseAccessToken(context)
    {
      // https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
      if (this.$route.params.access_token != "")
      {
        let token = this.$router.params.access_token.substring(1).split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        context.commit('setAccessToken', token);
        context.commit('setSpotifyWebApi');
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
    },
    async getTopTracks(context, payload) {
      // {limit: Number, range: Number}
      try {
        console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
        let response = await this.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.range});
        console.table(response.items);
        return response;
      } catch (error) {
          console.log(error);
      }  
    },
    async getRecentlyPlayed(context, payload) {
      // {limit: Number, range: Number}
      try {
          console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
          let response = await this.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit, after: payload.range});
          console.table(response.items);
          return response;
      } catch (error) {
          console.log(error);
      }
    },
    async getAudioFeaturesForTracks(context, payload) {
      // {track_ids: Array}
      try {
        console.log('%c Requesting Song Data.', 'color: blue;');
        let response = await this.state.spotifyApi.getAudioFeaturesForTracks(payload.track_ids);
        console.table(response.audio_features);
        return response;
      } catch (error) {
          console.log(error);
      }
    }, 
    changeIndex(context, payload) {
      context.commit('setIndex', payload.index);
    }
    
  }
})