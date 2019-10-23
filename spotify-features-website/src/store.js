import Vue from 'vue'
import Vuex from 'vuex'

var SpotifyWebApi = require('spotify-web-api-js');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    testing: true,
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
      },
      {
        title: "Boring-Radar",
        path: "boring",
        auth: true,
        description: [
          "Is your music taste BORING?",
        ],
        img: "boring",
        color: {red: 180, green: 100, blue: 100},
        state: false,
      }
    ],
    index: 0,
    libraryData: {
      complete: [false, false, false],
      tracks: [],
      artists: {},
      favoriteArtists: [],
      genres: {},
      favoriteGenres: [],
      dates: [],
      audio_features: {
        acousticness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        danceability: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        energy: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        instrumentalness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        liveness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        mode: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [-1],
        },
        speechiness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        tempo: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [-1],
        },
        total: 0,
        valence: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        },
      },
      bangers: {
        value: 0,
        plot: [0,0,0,0,0,0,0,0,0,0],
        maxchart: [],
        minchart: [],
      },
    },
    progress: {
      num: 0,
      message: "Pluggin in headphones.",
      total: 0,
    }
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
    setLibraryData(state, data) {
      state.libraryData = data;
    },
    setProgress(state, num) {
      state.progress.num = num;
    },
    setMessage(state, message) {
      state.progress.message = message;
    },
    setTotal(state, total) {
      state.progress.total = total;
    },
    addTracks(state, tracks) {
      state.libraryData.tracks = state.libraryData.tracks.concat(tracks);
    },
    addBangerValue(state, val) {
      state.libraryData.bangers.value += val;
    },
    plotBanger(state, index) {
      state.libraryData.bangers.plot[index] += 1;
    }
  },
  actions: {
    changeLibraryData(context, payload) {
      context.commit('setLibraryData', payload);
    },
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
      context.commit('setToken', token.access_token);
    },
    getAccessToken(context)
    {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
      let redirectUri = 'http://mymusic.andrewdanielyoung.com/redirect/';
      if (this.state.testing)
        redirectUri = 'http://localhost:8080/redirect/';
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
    async runLibraryAnalysis(context, payload) {
      let now = new Date();
      let nt = now.getTime();
      let month = 2626560000;
      if (this.$router.currentRoute.name != "libraryanalysis")
        return;
      let response = await dispatch('getSavedTracks',{limit: payload.limit, offset: payload.offset});
      context.commit('setTotal', response.total);
      if (this.state.progress.num / this.state.progress.total > .8)
        context.commit('setMessage', "♪┏(・o･)┛♪┗ ( ･o･) ┓♪");
      else if (this.state.progress.num / this.state.progress.total > .6)
        context.commit('setMessage', "Sick beats dude.");
      else if (this.state.progress.num / this.state.progress.total > .4)
        context.commit('setMessage', "Jamming out to your tunes.");
      else if (this.state.progress.num / this.state.progress.total > .2)
        context.commit('setMessage', "Beep Bop. Analyzing Data.");
      let ids = [];
      for (var i = 0; i < response.items.length; i++)
      {
        ids.push(response.items[i].track.id);
        if (!(response.items[i].track.artists[0].name in this.state.libraryData.artists))
          this.state.libraryData.artists[response.items[i].track.artists[0].name] = {num: 1, id: response.items[i].track.artists[0].id};
        else 
          this.state.libraryData.artists[response.items[i].track.artists[0].name].num += 1;
        let date = new Date(response.items[i].added_at);
        let t = date.getTime();
        response.items[i].track.date_added = t;
        let diff = Math.floor((nt - t) / month);
        if (this.state.libraryData.dates.length - 1 < diff)
        {
          for (var j = 0; j < (diff - (this.state.libraryData.dates.length - 1)); j++)
          {
            this.state.libraryData.dates.push(0);
          }
          this.state.libraryData.dates.push(0);
          this.state.libraryData.dates.push(0);
        }
        this.state.libraryData.dates[diff] += 1;
      }
      let tracks = await dispatch('getAudioFeaturesForTracks', ids);
      this.dispatch('analyseData', tracks);
      if (response.items.length == 50)
        this.dispatch.retriveData({offset: offset + limit, limit: limit});
      else {
        let keys = Object.keys(this.audio_features);
        for (var i = 0; i < keys.length; i++)
        {
          if (keys[i] == "total")
            continue;
          this.state.libraryData.audio_features[keys[i]].value /= this.state.libraryData.audio_features.total;
        }
        this.state.libraryData.complete[0] = true;
        this.state.libraryData.complete[1] = true;
        await this.dispatch('checkArtists');
        this.dispatch('checkGenres');
      }
    },
    banger(context, payload) {
      return (payload.tempo - 96 + (payload.energy * 100) + (payload.danceability*50)) / 210;
    },

    analyseData(context, tracks) {
      if (this.$router.currentRoute.name != "libraryanalysis")
        return;
      context.commit('addTracks', tracks);
      let keys = Object.keys(this.state.libraryData.audio_features);
      for (let i = 0; i < tracks.length; i++)
      {
        context.commit('addBangerValue', this.dispatch('banger', {loudness: tracks[i].loudness, energy: tracks[i].energy, danceability: tracks[i].danceability}));
        let bangersPos = (Math.floor(this.dispatch('banger', {loudness: tracks[i].loudness, energy: tracks[i].energy, danceability: tracks[i].danceability}) * 10));
        if (bangersPos < this.state.libraryData.bangers.plot.length)
          context.commit('plotBanger', bangersPos);
        else
          context.commit('plotBanger', this.state.libraryData.bangers.plot.length - 1);
        for (let j = 0; j < keys.length; j++)
        {
          if (keys[j] == "total")
          {
            // STOPPED HERE.
            this.audio_features.total += 1;
            continue;
          }
          this.audio_features[keys[j]].value += tracks[i][keys[j]];
          if (this.audio_features[keys[j]].plot[0] != -1)
            this.audio_features[keys[j]].plot[(Math.floor(tracks[i][keys[j]] * 10))] += 1;
          for (let k = 0; k < this.audio_features[keys[j]].minchart.length; k++)
          {
            if (this.audio_features[keys[j]].minchart[k].value > tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].minchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].minchart.length > 20)
                this.audio_features[keys[j]].minchart.splice(20, 1);
              break;
            }
            if (k == this.audio_features[keys[j]].minchart.length - 1 && this.audio_features[keys[j]].minchart.length < 20)
            {
              this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].minchart.length == 0)
            this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
          for (let k = 0; k < this.audio_features[keys[j]].maxchart.length; k++)
          {
            if (this.audio_features[keys[j]].maxchart[k].value < tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].maxchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].maxchart.length > 20)
                this.audio_features[keys[j]].maxchart.splice(20, 1);
              break;
            }
            if (k == this.audio_features[keys[j]].maxchart.length - 1 && this.audio_features[keys[j]].maxchart.length < 20)
            {
              this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].maxchart.length == 0)
            this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
        }
        let bangindex = this.banger(tracks[i].loudness, tracks[i].tempo, tracks[i].energy, tracks[i].danceability);
        for (let k = 0; k < this.bangers.minchart.length; k++)
        {
          if (this.bangers.minchart[k].value > bangindex)
          {
            this.bangers.minchart.splice(k, 0, {id: tracks[i].id, value: bangindex});
            if (this.bangers.minchart.length > 20)
              this.bangers.minchart.splice(20, 1);
            break;
          }
          if (k == this.bangers.minchart.length - 1 && this.bangers.minchart.length < 20)
          {
            this.bangers.minchart.push({id: tracks[i].id, value: bangindex});
            break;
          }
        }
        if (this.bangers.minchart.length == 0)
          this.bangers.minchart.push({id: tracks[i].id, value: bangindex});
        for (let k = 0; k < this.bangers.maxchart.length; k++)
        {
          if (this.bangers.maxchart[k].value < bangindex)
          {
            this.bangers.maxchart.splice(k, 0, {id: tracks[i].id, value: bangindex});
            if (this.bangers.maxchart.length > 20)
              this.bangers.maxchart.splice(20, 1);
            break;
          }
          if (k == this.bangers.maxchart.length - 1 && this.bangers.maxchart.length < 20)
          {
            this.bangers.maxchart.push({id: tracks[i].id, value: bangindex});
            break;
          }
        }
        if (this.bangers.maxchart.length == 0)
          this.bangers.maxchart.push({id: tracks[i].id, value: bangindex});
        this.progress += 1;
      }
    },
    async checkArtists() {
      let max = 4;
      for (var artist in this.artists) {
        let added = false;
        for (var i = 0; i < this.favoriteArtists.length; i++)
        {
          if (this.favoriteArtists[i].num < this.artists[artist].num)
          {
            this.favoriteArtists.splice(i, 0, {name: artist, num: this.artists[artist].num, id: this.artists[artist].id});
            added = true;
            break;
          }
          if (this.favoriteArtists.length > max)
            this.favoriteArtists.splice(this.favoriteArtists.length - 1, 1);
        }
        if (this.favoriteArtists.length < max && !added) 
          this.favoriteArtists.push({name: artist, num: this.artists[artist].num, id: this.artists[artist].id});
      }
      let favoriteArtist = await this.$store.dispatch('getArtist', this.favoriteArtists[0].id);
      this.favoriteArtists[0].image = favoriteArtist.images[0].url;
      this.artistsDone = true;
      this.libraryData.artists = this.artists;
    },
    async checkGenres() {
      let max = 4;
      let querymax = 50;
      let artistsIds = [];
      for (var artist in this.artists) {
        if (querymax == 0)
        {
          let artistsData = await this.$store.dispatch('getArtists', artistsIds);
          for (var i = 0; i < artistsData.artists.length; i++)
          {
            for (var j = 0; j < artistsData.artists[i].genres.length; j++)
            {
              if (!(artistsData.artists[i].genres[j] in this.genres))
                this.genres[artistsData.artists[i].genres[j]] = {num: this.artists[artist].num, genre: artistsData.artists[i].genres[j]};
              else 
                this.genres[artistsData.artists[i].genres[j]].num += this.artists[artist].num;
            }
          }
          querymax = 50;
          artistsIds = [];
        }
        if (artist in this.artists)
        {
          artistsIds.push(this.artists[artist].id);
          querymax -= 1;
        }
      }

      for (var genre in this.genres) {
        let added = false;
        for (var i = 0; i < this.favoriteGenres.length; i++)
        {
          if (this.favoriteGenres[i].num < this.genres[genre].num)
          {
            this.favoriteGenres.splice(i, 0, {genre: genre, num: this.genres[genre].num});
            added = true;
            break;
          }
          if (this.favoriteGenres.length > max)
            this.favoriteGenres.splice(this.favoriteGenres.length - 1, 1);
        }
        if (this.favoriteGenres.length < max && !added)
          this.favoriteGenres.push({genre: genre, num: this.genres[genre].num});
      }
      this.genresDone = true;
      this.libraryData.genres = this.genres;
    },



    start(context, payload) {
      this.dispatch('runLibraryAnalysis');
    },
    changeIndex(context, payload) {
      context.commit('setIndex', payload.index);
    },
    inicializeSpotifyApi(context) {
      console.log('%c Inicializing Authorization.', 'color: purple;');
      this.state.spotifyApi.setAccessToken(this.state.accessToken);
      context.commit('setInicialized', true);
    },
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopArtists(context, payload) {
        try {
            console.log('%c Retrieving Top Played Artists.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyTopArtists({limit: payload.limit, time_range: payload.time_range});
            return response.items;
        } catch (error) {
            console.log(error);
        }  
    },
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopTracks(context, payload) {
        try {
            console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
            return response.items;
        } catch (error) {
            console.log(error);
        }  
    },
    // {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds
    async getRecentlyPlayed(context, payload) {
        try {
            console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
            let response = await this.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
            return response;
        } catch (error) {
            console.log(error);
        }
    },  
    async getTrack(context, track_id) {
      try {
          console.log('%c Requesting Song Data.', 'color: blue;');
          let response = await this.state.spotifyApi.getTrack(track_id);
          return response;
      } catch (error) {
          console.log(error);
      }
    },
    async getTracks(context, track_ids) {
      try {
          console.log('%c Requesting Songs Data.', 'color: blue;');
          let response = await this.state.spotifyApi.getTracks(track_ids);
          return response;
      } catch (error) {
          console.log(error);
      }
    },
    // {artistId: String}
    async getArtist(context, id) {
        try {
            console.log('%c Requesting Artist.', 'color: blue;');
            let response = await this.state.spotifyApi.getArtist(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    },  
    // []
    async getArtists(context, ids) {
      try {
          console.log('%c Requesting Artists.', 'color: blue;');
          let response = await this.state.spotifyApi.getArtists(ids);
          return response;
      } catch (error) {
          console.log(error);
      }
    }, 
    // Array IDs
    async getAudioFeaturesForTracks(context, track_ids) {
        try {
            console.log('%c Requesting Song Data.', 'color: blue;');
            let response = await this.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
            return response.audio_features;
        } catch (error) {
            console.log(error);
        }
    },
    async getAudioFeaturesForTrack(context, track_id) {
      try {
          console.log('%c Requesting Song Analysis.', 'color: blue;');
          let response = await this.state.spotifyApi.getAudioFeaturesForTracks([track_id]);
          return response.audio_features[0];
      } catch (error) {
          console.log(error);
      }
    },
    async getAudioAnalysisForTrack(context, track_id) {
        try {
            console.log('%c Requesting Audio Analysis.', 'color: blue;');
            let response = await this.state.spotifyApi.getAudioAnalysisForTrack(track_id);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    // {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
    async getRecomendations(context, payload) {
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
    async getSavedTracks(context, payload) {
        try {
            console.log('%c Requesting Library Data.', 'color: blue;');
            let response = await this.state.spotifyApi.getMySavedTracks({limit: payload.limit, offset: payload.offset});
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
    async searchSpotify(context, payload) {
        try {
            console.log('%c Searching.', 'color: blue;');
            let response = await this.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
            return response.tracks.items;
        } catch (error) {
            console.log(error);
        }
    },
    
  }
})