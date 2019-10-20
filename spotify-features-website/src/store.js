import Vue from 'vue'
import Vuex from 'vuex'

var SpotifyWebApi = require('spotify-web-api-js');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spotifyApi: new SpotifyWebApi(),
    accessToken: "",
    inicialized: false,
    apps: [
      {
        title: "Song Analysis",
        path: "songanalysis",
        auth: false,
        description: [
          "View all available information Spotify offers on a given song.",
        ],
        img: "search",
        color: {red: 255, green: 165, blue: 30},
        state: true,
      },
      {
        title: "My Charts",
        path: "mycharts",
        auth: true,
        description: [
          "View your personalized top charts and artists.",
        ],
        img: "chart",
        color: {red: 238, green: 126, blue: 137},
        state: false,
      },
      {
        title: "Library Analysis",
        path: "libraryanalysis",
        auth: true,
        description: [
          "Discover the averages and extremes within your library.",
        ],
        img: "library",
        color: {red: 84, green: 224, blue: 210},
        state: false,
      },
      {
        title: "My Music Mood",
        path: "mymusicmood",
        auth: true,
        description: [
          "What does your music say about you?",
        ],
        img: "musicmood",
        color: {red: 180, green: 100, blue: 100},
        state: false,
      }
    ],
    index: 0,
  },
  mutations: {
    setIndex(state, index) {
      state.index = index;
    },
    setInicialized(state, inicialized) {
      state.inicialized = inicialized;
    },
    setToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {
    parseAccessToken(context)
    {
        let token = window.location.hash.substring(1).split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        context.commit('setToken', token);
    },
    getAccessToken(context)
    {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
      const redirectUri = 'http://spotifyfeatures.andrewdanielyoung.com/redirect/';
      const scopes = [
        'user-read-recently-played',
        'user-top-read',
        'user-library-read',
        'user-read-email',
      ];
      if (!this.state.access_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
      }
    },
    changeIndex(context, payload) {
      context.commit('setIndex', payload.index);
    },


    inicializeSpotifyApi(context) {
      this.state.spotifyApi.setAccessToken(this.state.accessToken);
      context.commit('setInicialized', true);
    },
  
    // clientID 42903eeb2bf943c4bd4903370f7a93f5
    
    
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopArtists(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }  
    },
    
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopTracks(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }  
    },
    
    // {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds}

    async getRecentlyPlayed(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {trackId: String}
    async getTrack(spotifyApi, payload) {
        try {
            console.log('%c Requesting Track.', 'color: blue;');
            let response = await this.state.spotifyApi.getTrack(payload.trackId);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {artistId: String}
    async getArtist(spotifyApi, payload) {
        try {
            console.log('%c Requesting Artist.', 'color: blue;');
            let response = await this.state.spotifyApi.getArtist(payload.artistId);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // Array IDs
    async getAudioFeaturesForTracks(spotifyApi, track_ids) {
        try {
            console.log('%c Requesting Song Data.', 'color: blue;');
            let response = await this.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
            console.table(response.audio_features);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    async getAudioAnalysis(spotifyApi, track_id) {
        try {
            console.log('%c Requesting Audio Analysis.', 'color: blue;');
            let response = await this.state.spotifyApi.getAudioAnalysisForTrack(track_id);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
    async getRecomendations(spotifyApi, payload) {
        try {
            console.log('%c Requesting Recommendations.', 'color: blue;');
            let response = await this.state.spotifyApi.getRecommendations(payload);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {limit: 1-50, offset: first index}
    async getMaxSavedTracks(spotifyApi, payload) {
        try {
            console.log('%c Requesting Library Data.', 'color: blue;');
            let response = await this.state.spotifyApi.getMySavedTracks(payload);
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // None
    async getUser() {
        try {
        console.log('%c Requesting Library Data.', 'color: blue;');
        let response = await this.state.spotifyApi.getMe();
        console.table(response);
        return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // Array IDs
    async searchSpotify(spotifyApi, payload) {
        try {
            console.log('%c Searching.', 'color: blue;');
            let response = await this.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
            console.table(response.audio_features);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
  }
})