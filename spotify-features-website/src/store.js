import Vue from 'vue'
import Vuex from 'vuex'

var SpotifyWebApi = require('spotify-web-api-js');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    testing: false,
    spotifyApi: new SpotifyWebApi(),
    accessToken: "",
    inicialized: false,
    apps: [
      {
        title: "Song Analysis",
        path: "songanalysis",
        auth: false,
        description: [
          "View in-depth information about a track including it's happiness, energy and danceability!",
          "After running Library Analysis, Song Analisis will provide additional information based on your Library's statistics.",
        ],
        img: "search",
        color: {red: 238, green: 126, blue: 137},
        state: true,
      },
      {
        title: "My Charts",
        path: "mycharts",
        auth: true,
        description: [
          "View your personalized top tracks and artists.",
          "View either with a time range of your choice! View your top tracks of all time, or your favorite artists over the last few weeks."
        ],
        img: "chart",
        color: {red: 230, green: 224, blue: 60},
        state: true,
      },
      {
        title: "Library Analysis",
        path: "libraryanalysis",
        auth: true,
        description: [
          "How happy is your library? Who is your top saved artist? What are you slowest songs?",
          "Discover the averages and extremes within your library.",
          "Library Analysis gathers all data relavant to your library and process' out some cool statistics!"
        ],
        img: "library",
        color: {red: 240, green: 100, blue: 50},
        state: true,
      },
      {
        title: "My Music Mood",
        path: "mymusicmood",
        auth: true,
        description: [
          "What does your music say about you?",
          "Based on either your most recently played, or recent top tracks, My Music Mood will attempt to analyse tracks you've been into lately and determine your mood!",
        ],
        img: "musicmood",
        color: {red: 255, green: 165, blue: 30},
        state: false,
      },
      {
        title: "Boring-Radar",
        path: "boring",
        auth: true,
        description: [
          "Is your music taste BORING?",
          "The Boring-Radar will either confirm or rebute your greatest fears by analysing data from Library Analysis to determine the standard deviation of your library through multiple variables.",
        ],
        img: "boring",
        color: {red: 180, green: 100, blue: 240},
        state: false,
      },
      {
        title: "Power Recommends",
        path: "recommends",
        auth: true,
        description: [
          "I like this song, but I want one like it but happier. DONE.",
          "Taylor your recommends to fit your exact wishes, and find songs more accuratly attuned to what you're looking for.",
          "Get recommends based on a track, but specify what statistics you'd like your new songs to maintain, or change.",
        ],
        img: "power",
        color: {red: 180, green: 230, blue: 100},
        state: false,
      }
    ],
    index: 0,
    libraryData: {
      complete: {
        done: false,
        audioFeaturesDone: false, 
        artistsDone: false,
        genresDone: false,
      },
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
    },
    tempBanger: 0,
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
    setProgress(state) {
      state.progress.num += 1;
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
    },
    spliceBanger(state, payload) {
      if (payload.replace != null)
        state.libraryData.bangers[payload.type].splice(payload.index, payload.num, payload.replace);
      else 
        state.libraryData.bangers[payload.type].splice(payload.index, payload.num);
    },
    pushBanger(state, payload) {
      state.libraryData.bangers[payload.type].push(payload.value);
    },
    addAudioFeaturesTotal(state) {
      state.libraryData.audio_features.total += 1;
    },
    addAudioFeature(state, payload) {
      state.libraryData.audio_features[payload.key].value += payload.value;
    },
    plotAudioFeature(state, payload) {
      state.libraryData.audio_features[payload.key].plot[payload.index] += 1;
    },
    spliceAudioFeatures(state, payload) {
      if (payload.replace != null)
        state.libraryData.audio_features[payload.key][payload.type].splice(payload.index, payload.num, payload.replace);
      else 
        state.libraryData.audio_features[payload.key][payload.type].splice(payload.index, payload.num);
    },
    pushAudioFeatures(state, payload) {
      state.libraryData.audio_features[payload.key][payload.type].push(payload.value);
    },
    spliceFavoriteArtists(state, payload) {
      if (payload.replace != null)
        state.libraryData.favoriteArtists.splice(payload.index, payload.num, payload.replace);
      else
        state.libraryData.favoriteArtists.splice(payload.index, payload.num);
    }, 
    pushFavoriteArtists(state, artist) {
      state.libraryData.favoriteArtists.push(artist);
    },
    pushFavoriteGenres(state, genre) {
      state.libraryData.favoriteGenres.push(genre);
    },
    spliceFavoriteGenres(state, payload) {
      if (payload.replace != null)
        state.libraryData.favoriteGenres.splice(payload.index, payload.num, payload.replace);
      else
        state.libraryData.favoriteGenres.splice(payload.index, payload.num);
    }, 
    setFavoriteArtistImage(state, image) {
      state.libraryData.favoriteArtists[0].image = image;
    },
    setComplete(state, payload) {
      state.libraryData.complete[payload.index] = payload.value;
    },
    addGenre(state, payload) {
      state.libraryData.genres[payload.genre] = payload.value;
    },
    addArtist(state, payload) {
      state.libraryData.artists[payload.name] = payload.value;
    },
    addToArtist(state, artist) {
      state.libraryData.artists[artist].num += 1;
    },
    addToGenre(state, payload) {
      state.libraryData.genres[payload.genre].num += payload.num;
    },
    pushDate(state) {
      state.libraryData.dates.push(0);
    },
    addToDate(state, date) {
      state.libraryData.dates[date] += 1;
    },
    averageAudioFeature(state, key){
      state.libraryData.audio_features[key].value /= state.progress.total;
    },
    setTempBanger(state, level) {
      state.tempBanger = level;
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
    runLibraryAnalysis(context) {
      this.dispatch("retriveData", {offset: 0, limit: 50});
    },
    async retriveData(context, payload) {
      let now = new Date();
      let nt = now.getTime();
      let month = 2626560000;
      let response = await this.dispatch('getSavedTracks',{limit: payload.limit, offset: payload.offset});
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
          context.commit('addArtist', {name: response.items[i].track.artists[0].name, value: {num: 1, id: response.items[i].track.artists[0].id}});
        else 
          context.commit('addToArtist', response.items[i].track.artists[0].name);
          
        let date = new Date(response.items[i].added_at);
        let t = date.getTime();
        response.items[i].track.date_added = t;
        let diff = Math.floor((nt - t) / month);
        if (this.state.libraryData.dates.length - 1 < diff)
        {
          for (var j = 0; j < (diff - (this.state.libraryData.dates.length - 1)); j++)
          {
            context.commit('pushDate');
          }
          context.commit('pushDate');
          context.commit('pushDate');
        }
        context.commit('addToDate', diff);
      }
      let tracks = await this.dispatch('getAudioFeaturesForTracks', ids);
      await this.dispatch('analyseData', tracks);
      if (response.items.length == 50)
        this.dispatch('retriveData', {offset: payload.offset + payload.limit, limit: payload.limit});
      else {
        let keys = Object.keys(this.state.libraryData.audio_features);
        for (var i = 0; i < keys.length; i++)
        {
          if (keys[i] == "total")
            continue;
          context.commit('averageAudioFeature', keys[i]);
        }
        context.commit('setComplete', {index: "done", value: true});
        context.commit('setComplete', {index: "audioFeaturesDone", value: true});
        console.log('%c Processing Track Audio Features Complete.', 'color: purple;');
        await this.dispatch('checkArtists');
        console.log('%c Processing Artists Complete.', 'color: purple;');
        await this.dispatch('checkGenres');
        console.log('%c Processing Genres Complete.', 'color: purple;');
      }
    },
    banger(context, payload) {
      let bangerLevel = ((payload.tempo - 96 + (payload.energy * 100) + (payload.danceability*50)) / 210);
      context.commit('setTempBanger', bangerLevel);
    },
    async analyseData(context, tracks) {
      context.commit('addTracks', tracks);
      let keys = Object.keys(this.state.libraryData.audio_features);
      for (let i = 0; i < tracks.length; i++)
      {
        await this.dispatch('banger', {tempo: tracks[i].tempo, energy: tracks[i].energy, danceability: tracks[i].danceability});
        context.commit('addBangerValue', this.state.tempBanger);
        let bangersPos = (Math.floor(this.state.tempBanger * 10));
        if (bangersPos < this.state.libraryData.bangers.plot.length)
          context.commit('plotBanger', bangersPos);
        else
          context.commit('plotBanger', this.state.libraryData.bangers.plot.length - 1);
        for (let j = 0; j < keys.length; j++)
        {
          if (keys[j] == "total")
          {
            context.commit('addAudioFeaturesTotal');
            continue;
          }
          context.commit('addAudioFeature', {key: keys[j], value: tracks[i][keys[j]]})
          if (this.state.libraryData.audio_features[keys[j]].plot[0] != -1)
            context.commit('plotAudioFeature', {key: keys[j], index: (Math.floor(tracks[i][keys[j]] * 10))})
          for (let k = 0; k < this.state.libraryData.audio_features[keys[j]].minchart.length; k++)
          {
            if (this.state.libraryData.audio_features[keys[j]].minchart[k].value > tracks[i][keys[j]])
            {
              context.commit('spliceAudioFeatures', {key: keys[j], type: "minchart", index: k, num: 0, replace: {id: tracks[i].id, value: tracks[i][keys[j]]}});
              if (this.state.libraryData.audio_features[keys[j]].minchart.length > 20)
                context.commit('spliceAudioFeatures', {key: keys[j], type: "minchart", index: 20, num: 1, replace: null});
              break;
            }
            if (k == this.state.libraryData.audio_features[keys[j]].minchart.length - 1 && this.state.libraryData.audio_features[keys[j]].minchart.length < 20)
            {
              context.commit('pushAudioFeatures', {key: keys[j], type: "minchart", value: {id: tracks[i].id, value: tracks[i][keys[j]]}});
              break;
            }
          }
          if (this.state.libraryData.audio_features[keys[j]].minchart.length == 0)
            context.commit('pushAudioFeatures', {key: keys[j], type: "minchart", value: {id: tracks[i].id, value: tracks[i][keys[j]]}});
          for (let k = 0; k < this.state.libraryData.audio_features[keys[j]].maxchart.length; k++)
          {
            if (this.state.libraryData.audio_features[keys[j]].maxchart[k].value < tracks[i][keys[j]])
            {
              context.commit('spliceAudioFeatures', {key: keys[j], type: "maxchart", index: k, num: 0, replace: {id: tracks[i].id, value: tracks[i][keys[j]]}});
              if (this.state.libraryData.audio_features[keys[j]].maxchart.length > 20)
                context.commit('spliceAudioFeatures', {key: keys[j], type: "maxchart", index: 20, num: 1, replace: null});
              break;
            }
            if (k == this.state.libraryData.audio_features[keys[j]].maxchart.length - 1 && this.state.libraryData.audio_features[keys[j]].maxchart.length < 20)
            {
              context.commit('pushAudioFeatures', {key: keys[j], type: "maxchart", value: {id: tracks[i].id, value: tracks[i][keys[j]]}});
              break;
            }
          }
          if (this.state.libraryData.audio_features[keys[j]].maxchart.length == 0)
            context.commit('pushAudioFeatures', {key: keys[j], type: "maxchart", value: {id: tracks[i].id, value: tracks[i][keys[j]]}});
        }
        await this.dispatch('banger', {tempo: tracks[i].tempo, energy: tracks[i].energy, danceability: tracks[i].danceability});
        let bangindex = this.state.tempBanger;
        for (let k = 0; k < this.state.libraryData.bangers.minchart.length; k++)
        {
          if (this.state.libraryData.bangers.minchart[k].value > bangindex)
          {
            context.commit('spliceBanger', {type: "minchart", index: k, num: 0, replace: {id: tracks[i].id, value: bangindex}});
            if (this.state.libraryData.bangers.minchart.length > 20)
              context.commit('spliceBanger', {type: "minchart", index: 20, num: 1, replace: null});
            break;
          }
          if (k == this.state.libraryData.bangers.minchart.length - 1 && this.state.libraryData.bangers.minchart.length < 20)
          {
            context.commit('pushBanger', {type: "minchart", value: {id: tracks[i].id, value: bangindex}});
            break;
          }
        }
        if (this.state.libraryData.bangers.minchart.length == 0)
          context.commit('pushBanger', {type: "minchart", value: {id: tracks[i].id, value: bangindex}});
        for (let k = 0; k < this.state.libraryData.bangers.maxchart.length; k++)
        {
          if (this.state.libraryData.bangers.maxchart[k].value < bangindex)
          {
            context.commit('spliceBanger', {type: "maxchart", index: k, num: 0, replace: {id: tracks[i].id, value: bangindex}});
            if (this.state.libraryData.bangers.maxchart.length > 20)
              context.commit('spliceBanger', {type: "maxchart", index: 20, num: 1, replace: null});
            break;
          }
          if (k == this.state.libraryData.bangers.maxchart.length - 1 && this.state.libraryData.bangers.maxchart.length < 20)
          {
            context.commit('pushBanger', {type: "maxchart", value: {id: tracks[i].id, value: bangindex}});
            break;
          }
        }
        if (this.state.libraryData.bangers.maxchart.length == 0)
          context.commit('pushBanger', {type: "maxchart", value: {id: tracks[i].id, value: bangindex}});
        context.commit('setProgress');
      }
    },
    async checkArtists(context) {
      let max = 4;
      for (var artist in this.state.libraryData.artists) {
        let added = false;
        for (var i = 0; i < this.state.libraryData.favoriteArtists.length; i++)
        {
          if (this.state.libraryData.favoriteArtists[i].num < this.state.libraryData.artists[artist].num)
          {
            context.commit('spliceFavoriteArtists', {index: i, num: 0, replace: {name: artist, num: this.state.libraryData.artists[artist].num, id: this.state.libraryData.artists[artist].id}});
            added = true;
            break;
          }
          if (this.state.libraryData.favoriteArtists.length > max)
            context.commit('spliceFavoriteArtists', {index: this.state.libraryData.favoriteArtists.length - 1, num: 1, replace: null});
        }
        if (this.state.libraryData.favoriteArtists.length < max && !added) 
          context.commit('pushFavoriteArtists', {name: artist, num: this.state.libraryData.artists[artist].num, id: this.state.libraryData.artists[artist].id});
      }
      let favoriteArtist = await this.dispatch('getArtist', this.state.libraryData.favoriteArtists[0].id);
      context.commit('setFavoriteArtistImage', favoriteArtist.images[0].url);
      
      context.commit('setComplete', {index: "artistsDone", value: true});
    },
    async checkGenres(context) {
      let max = 4;
      let querymax = 50;
      let artistsIds = [];
      for (var artist in this.state.libraryData.artists) {
        if (querymax == 0)
        {
          let artistsData = await this.dispatch('getArtists', artistsIds);
          for (var i = 0; i < artistsData.artists.length; i++)
          {
            for (var j = 0; j < artistsData.artists[i].genres.length; j++)
            {
              if (!(artistsData.artists[i].genres[j] in this.state.libraryData.genres))
                context.commit('addGenre', {genre: artistsData.artists[i].genres[j], value: {num: this.state.libraryData.artists[artist].num, genre: artistsData.artists[i].genres[j]}})
              else 
                context.commit('addToGenre', {genre: artistsData.artists[i].genres[j], num: this.state.libraryData.artists[artist].num})
            }
          }
          querymax = 50;
          artistsIds = [];
        }
        if (artist in this.state.libraryData.artists)
        { 
          artistsIds.push(this.state.libraryData.artists[artist].id);
          querymax -= 1;
        }
      }

      for (var genre in this.state.libraryData.genres) {
        let added = false;
        for (var i = 0; i < this.state.libraryData.favoriteGenres.length; i++)
        {
          if (this.state.libraryData.favoriteGenres[i].num < this.state.libraryData.genres[genre].num)
          {
            context.commit('spliceFavoriteGenres', {index: i, num: 0, replace: {genre: genre, num: this.state.libraryData.genres[genre].num}});
            added = true;
            break;
          }
          if (this.state.libraryData.favoriteGenres.length > max)
            context.commit('spliceFavoriteGenres', {index: this.state.libraryData.favoriteGenres.length - 1, num: 1, replace: null});
        }
        if (this.state.libraryData.favoriteGenres.length < max && !added)
          context.commit('pushFavoriteGenres', {genre: genre, num: this.state.libraryData.genres[genre].num})
      }
      context.commit('setComplete', {index: "genresDone", value: true});
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
            console.log('%c Requesting Library Data. ' + payload.offset + '-' + (payload.offset + payload.limit), 'color: blue;');
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