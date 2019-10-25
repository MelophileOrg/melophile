////////////////////////////////////////////////////////////////
// INICIALIZATION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const inicializeGetToken = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
    let redirectUri = 'http://mymusic.andrewdanielyoung.com/redirect/';
    if (this.state.dev)
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
};
// None
const inicializeParseToken = () => {
    let token = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    this.dispatch('inicializeSetToken', token.access_token);
};
// Token
const inicializeSetToken = async (context, token) => {
    console.log('%c Inicializing Authorization.', 'color: purple;');
    this.state.spotifyApi.setAccessToken(token);
    await context.commit('setInicialized', true);
    this.dispatch('getUser');
};
////////////////////////////////////////////////////////////////
// LOAD PROGRESS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// AUDIO FEATURES //////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// FAVORITE ARTISTS ////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// FAVORITE GENRES /////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// TOP TRACKS/ARTISTS //////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// SOCIAL //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// API CALLS ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopArtists = async (context, payload) => {
    try {
        console.log('%c Retrieving Top Played Artists.', 'color: blue;');
        let response = await this.state.spotifyApi.getMyTopArtists({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        console.log(error);
    } 
};
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopTracks = async (context, payload) => {
    try {
        console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
        let response = await this.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        console.log(error);
    }  
};
// {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds
const getRecentlyPlayed = async (context, payload) => {
    try {
        console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
        let response = await this.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
        return response;
    } catch (error) {
        console.log(error);
    }
};
const getTrack = async (context, track_id) => {
  try {
      console.log('%c Requesting Song Data.', 'color: blue;');
      let response = await this.state.spotifyApi.getTrack(track_id);
      return response;
  } catch (error) {
      console.log(error);
  }
};
const getTracks = async (context, track_ids) => {
  try {
      console.log('%c Requesting Songs Data.', 'color: blue;');
      let response = await this.state.spotifyApi.getTracks(track_ids);
      return response;
  } catch (error) {
      console.log(error);
  }
};
// {artistId: String}
const getArtist = async (context, id) => {
    try {
        console.log('%c Requesting Artist.', 'color: blue;');
        let response = await this.state.spotifyApi.getArtist(id);
        return response;
    } catch (error) {
        console.log(error);
    }
}; 
// []
const getArtists = async (context, ids) => {
  try {
      console.log('%c Requesting Artists.', 'color: blue;');
      let response = await this.state.spotifyApi.getArtists(ids);
      return response;
  } catch (error) {
      console.log(error);
  }
};
// Array IDs
const getAudioFeaturesForTracks = async (context, track_ids) => {
    try {
        console.log('%c Requesting Song Data.', 'color: blue;');
        let response = await this.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
        return response.audio_features;
    } catch (error) {
        console.log(error);
    }
};
const getAudioFeaturesForTrack = async (context, track_id) => {
  try {
      console.log('%c Requesting Song Analysis.', 'color: blue;');
      let response = await this.state.spotifyApi.getAudioFeaturesForTracks([track_id]);
      return response.audio_features[0];
  } catch (error) {
      console.log(error);
  }
};
const getAudioAnalysisForTrack = async (context, track_id) => {
    try {
        console.log('%c Requesting Audio Analysis.', 'color: blue;');
        let response = await this.state.spotifyApi.getAudioAnalysisForTrack(track_id);
        return response;
    } catch (error) {
        console.log(error);
    }
};
// {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
const getRecomendations = async (context, payload) => {
    try {
        console.log('%c Requesting Recommendations.', 'color: blue;');
        let response = await this.state.spotifyApi.getRecommendations(payload);
        console.table(response);
        return response;
    } catch (error) {
        console.log(error);
    }
};
// {limit: 1-50, offset: first index}
const getSavedTracks = async (context, payload) => {
    try {
        console.log('%c Requesting Library Data. ' + payload.offset + '-' + (payload.offset + payload.limit), 'color: blue;');
        let response = await this.state.spotifyApi.getMySavedTracks({limit: payload.limit, offset: payload.offset});
        return response;
    } catch (error) {
        console.log(error);
    }
};
// None
const getUser = async (context) => {
    try {
      if (this.state.inicialized)
      {
        console.log('%c Requesting user Data.', 'color: blue;');
        let response = await this.state.spotifyApi.getMe();
        await context.commit('setUser', response);
      }
    } catch (error) {
        console.log(error);
    }
};
// Array IDs
const getSearch = async (context, payload) => {
    try {
        console.log('%c Searching.', 'color: blue;');
        let response = await this.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
        return response.tracks.items;
    } catch (error) {
        console.log(error);
    }
};
  
export default {
    inicializeGetToken,
    inicializeParseToken,
    inicializeSetToken,

    getTopArtists,
    getTopTracks,
    getRecentlyPlayed,
    getTrack,
    getTracks,
    getArtist,
    getArtists,
    getAudioFeaturesForTracks,
    getAudioFeaturesForTrack,
    getAudioAnalysisForTrack,
    getRecomendations,
    getSavedTracks,
    getUser,
    getSearch
};