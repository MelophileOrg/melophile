////////////////////////////////////////////////////////////////
// INICIALIZATION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const inicializeGetToken = (context) => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
    let redirectUri = 'http://mymusictaste.org/redirect/';
    if (context.state.dev)
        redirectUri = 'http://localhost:8080/redirect/';
    const scopes = [
        'user-read-recently-played',
        'user-top-read',
        'user-library-read',
        'user-read-email',
    ];
    if (!context.state.access_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }
};
// None
const inicializeParseToken = (context) => {
    let token = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    context.dispatch('inicializeSetToken', token.access_token);
};
// Token
const inicializeSetToken = async (context, token) => {
    await context.state.spotifyApi.setAccessToken(token);
    await context.commit('setInicialized', true);
    context.dispatch('getUser');
};
////////////////////////////////////////////////////////////////
// LOAD LIBRARY ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const loadLibrary = async (context) => {
    await context.dispatch('retrieveSavedTracks', {limit: 50, offset: 0});
    context.commit('averageAudioFeatureValues');
    context.commit('averageMode');
    await context.dispatch('retrieveTopCharts');
    context.commit('setProgressTracks');
    context.commit('setProgressArtists');
    context.commit('setProgressGenres');
    context.commit('setProgressCharts');
    context.commit('setProgressTimelines');
    console.log(context.state);
};
const retrieveSavedTracks = async (context, payload) => {
    let tracks = await context.dispatch('getSavedTracks', {limit: payload.limit, offset: payload.offset});
    
    let ids = tracks.map(track => track.track.id);
    let audioFeatures = await context.dispatch('getAudioFeaturesForTracks', ids);
    let artistIds = {};
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].track.id in context.state.tracks)
            continue;
        context.dispatch('updateTimelines', {date: tracks[i].added_at, features: audioFeatures[i]});
        
        context.commit('pushTrack', await context.dispatch('convertTrackObject', {track: tracks[i].track, date: tracks[i].added_at}));
        context.dispatch('processAudioFeatures', audioFeatures[i]);
        for (let j = 0; j < tracks[i].track.artists.length; j++) {
            if (tracks[i].track.artists[j].id in context.state.tracks)
                context.commit('addTrackToArtist', {id: tracks[i].track.artists[j].id, track: tracks[i].track.id});
            else {
                if (!(tracks[i].track.artists[j].id in artistIds)) 
                    artistIds[tracks[i].track.artists[j].id] = [tracks[i].track.id];
                else 
                    artistIds[tracks[i].track.artists[j].id].push(tracks[i].track.id);
            }
        }
        context.commit('addProcessed');
        console.log(context.state.progress.processed);
    }
    await context.dispatch('retrieveSavedArtists', artistIds);
    if (tracks.length == payload.limit) {
        await context.dispatch('retrieveSavedTracks', {limit: 50, offset: payload.offset + payload.limit});
    }
    return;
};
const retrieveSavedArtists = async (context, payload) => {
    let ids = Object.keys(payload);
    let tracks = Object.values(payload);
    let artists = [];
    while (ids.length > 0) {
        let sectionIds = ids.splice(0, 50);
        let newArtists = await context.dispatch('getArtists', sectionIds);
        artists = artists.concat(newArtists);
    }
    for (let i = 0; i < artists.length; i++) {
        artists[i].tracks = tracks[i];
        let artistObject = await context.dispatch('convertArtistObject', artists[i]);
        context.commit('pushArtist', artistObject);
        for (let j = 0; j < artists[i].genres.length; j++) {
            if (artists[i].genres[j] in context.state.genres) {
                if (!(context.state.genres[artists[i].genres[j]].artists.includes(artists[i].id)))
                    context.commit('addArtistToGenre', {id: artists[i].genres[j], artist: artists[i].id});
                context.commit('addGenreTrackNum', {key: artists[i].genres[j], value: tracks[i].length});
                continue;
            }
            context.commit('pushGenre', await context.dispatch('generateGenre', {name: artists[i].genres[j], artists: [artists[i].id]}));
        }
    }
};
const updateTimelines = async (context, payload) => {
    let now = new Date();
    let date = new Date(payload.date);
    let months = (now.getFullYear() - date.getFullYear()) * 12;
    months += now.getMonth();
    months -= date.getMonth();
    context.commit('addDateAddedTimeline', months);
    let keys = Object.keys(context.state.audioFeatures);
    for (let i = 0; i < keys.length; i++) {
        context.commit('addAudioFeatureTimeline', {key: keys[i], month: months, value: payload.features[keys[i]]});
    }
};
const processAudioFeatures = async (context, payload) => {
    let keys = Object.keys(context.state.audioFeatures);
    payload.banger = await context.dispatch('bangerCalc', {tempo: payload.tempo, energy: payload.energy, danceability: payload.danceability});
    for (let i = 0; i < keys.length; i++) {
        let index = context.state.audioFeatures[keys[i]].minchart.length - 1;
        if (index < 0) 
            index = 0;
        if (context.state.audioFeatures[keys[i]].minchart.length < 25 || payload[keys[i]] < context.state.audioFeatures[keys[i]].minchart[index].value) {                
            while (index > 0 && payload[keys[i]] < context.state.audioFeatures[keys[i]].minchart[index].value) {
                index -= 1;
            }
            await context.commit('spliceAudioFeatureExtremes', {key: keys[i], chart: 'minchart', index: index, value: {id: payload.id, value: payload[keys[i]]}});
        }
        index = context.state.audioFeatures[keys[i]].maxchart.length - 1;
        if (index < 0) 
            index = 0;
        if (context.state.audioFeatures[keys[i]].maxchart.length < 25 || payload[keys[i]] > context.state.audioFeatures[keys[i]].maxchart[index].value) {
            while (index > 0 && payload[keys[i]] > context.state.audioFeatures[keys[i]].maxchart[index].value)
                index -= 1;
            await context.commit('spliceAudioFeatureExtremes', {key: keys[i], chart: 'maxchart', index: index, value: {id: payload.id, value: payload[keys[i]]}});
        }
        context.commit('addAudioFeatureValue', {key: keys[i], value: payload[keys[i]]});
        context.commit('plotAudioFeatureValue', {key: keys[i], value: payload[keys[i]]});
    }
    context.commit('addMode', payload.mode);
};
const retrieveTopCharts = async (context) => {
    let genreTuples = Object.entries(context.state.genres);
    let topGenres = genreTuples.sort(function(a,b) {
        if (!("trackNum" in a[1]) && !("trackNum" in b[1]))
            return 0;
        if (!("trackNum" in b[1]))
            return 0 - a[1].trackNum;
        if (!("trackNum" in a[1]))
            return b[1].trackNum;
        return b[1].trackNum - a[1].trackNum;
    }).slice(0,50);
    let topGenreIds = topGenres.map(genre => genre[0]);
    context.commit('setTopSavedGenres', topGenreIds);
    let artistTuples = Object.entries(context.state.artists);
    let topArtists = artistTuples.sort(function(a,b) {
        if (!("tracks" in a[1]) && !("tracks" in b[1]))
            return 0;
        if (!("tracks" in b[1]))
            return 0 - a[1].tracks.length;
        if (!("tracks" in a[1]))
            return b[1].tracks.length;
        return b[1].tracks.length - a[1].tracks.length
    }).slice(0,50);
    let topArtistIds = topArtists.map(artist => artist[0]);
    context.commit('setTopSavedArtists', topArtistIds);
    let terms = ['short_term', 'medium_term', 'long_term'];
    let topPlayed = {
        tracks: [[],[],[]],
        artists: [[],[],[]]
    }
    for (let i = 0; i < terms.length; i++) {
        let topTracks = await context.dispatch('getTopTracks', {limit: 50, time_range: terms[i]});
        for (let j = 0; j < topTracks.length; j++) {
            if (topTracks[j].id in context.state.tracks) 
                topPlayed.tracks[i].push(topTracks[j].id);
            else
                topPlayed.tracks[i].push(await context.dispatch('convertTrackObject', {track: topTracks[j]}));
        }
        let topArtists = await context.dispatch('getTopArtists', {limit: 50, time_range: terms[i]});
        for (let j = 0; j < topArtists.length; j++) {
            if (topArtists[j].id in context.state.artists) 
                topPlayed.artists[i].push(topArtists[j].id);
            else
                topPlayed.artists[i].push(await context.dispatch('convertArtistObject', topArtists[j]));
        }
    }
    context.commit('setTopPlayedTracks', topPlayed.tracks);
    context.commit('setTopPlayedArtists', topPlayed.artists);
};
/*
{
    id: String, 
    name: String,
    image: String,
    artists: Array,
}
*/
const convertTrackObject = async (context, payload) => {
    let trackObject = {};
    trackObject.id = payload.track.id;
    trackObject.name = payload.track.name;
    if ('album' in payload.track) 
        if ('images' in payload.track.album)
            if (payload.track.album.images.length > 0)
                trackObject.image = payload.track.album.images[0].url;
    if (typeof(payload.track.artists[0]) == 'object')
        trackObject.artists = payload.track.artists.map(artist => artist.id);
    if ('date' in payload)
        trackObject.date = payload.date;
    return trackObject;
};
const convertArtistObject = async (context, payload) => {
    let artistObject = {};
    artistObject.id = payload.id;
    artistObject.name = payload.name;
    if ('images' in payload)
        if (payload.images.length > 0)
            artistObject.image = payload.images[0].url;
    if ('genres' in payload)
        artistObject.genres = payload.genres;
    if ('tracks' in payload)
        artistObject.tracks = payload.tracks;
    return artistObject;
};
const generateGenre = async (context, payload) => {
    let genreObject = {};
    genreObject.name = payload.name;
    genreObject.artists = payload.artists;
    genreObject.trackNum = 1;
    return genreObject;
};
const bangerCalc = async (context, payload) => {
    return ((payload.tempo - 96 + (payload.energy * 100) + (payload.danceability*50)) / 210);
};
////////////////////////////////////////////////////////////////
// API CALLS ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// String
const getTrack = async (context, track_id) => {
  try {
      let response = await context.state.spotifyApi.getTrack(track_id);
      return response;
  } catch (error) {
      return;
  }
};
// Array of Strings
const getTracks = async (context, track_ids) => {
  try {
      let response = await context.state.spotifyApi.getTracks(track_ids);
      return response;
  } catch (error) {
      return;
  }
};
// String
const getArtist = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getArtist(id);
        return response;
    } catch (error) {
        return;
    }
}; 
// String
const getAlbum = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getAlbum(id);
        return response;
    } catch (error) {
        return;
    }
}; 
// Array of Strings
const getArtists = async (context, ids) => {
  try {
      let response = await context.state.spotifyApi.getArtists(ids);
      return response.artists;
  } catch (error) {
      return;
  }
};
//
const getArtistRelatedArtists = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getArtistRelatedArtists(id);
        return response.artists;
    } catch (error) {
        return;
    }
  };
// {limit: Number, offset: 0}
const getPlaylists = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getUserPlaylists(context.state.user.id, payload);
        return response.items;
    } catch (error) {
        return;
    }
};
// String
const getPlaylist = async (context, playlistId) => {
    try {
        let response = await context.state.spotifyApi.getPlaylist(playlistId);
        return response;
    } catch (error) {
        return;
    }
};
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopTracks = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        return;
    }  
};
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopArtists = async (context, payload) => {
    try { 
        let response = await context.state.spotifyApi.getMyTopArtists({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        return;
    } 
};
// {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds
const getRecentlyPlayed = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
        return response;
    } catch (error) {
        return;
    }
};
// Array of Strings
const getAudioFeaturesForTracks = async (context, track_ids) => {
    try {
        let response = await context.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
        return response.audio_features;
    } catch (error) {
        return;
    }
};
// String
const getAudioFeaturesForTrack = async (context, track_id) => {
  try {
      let response = await context.state.spotifyApi.getAudioFeaturesForTracks([track_id]);
      return response.audio_features[0];
  } catch (error) {
      return;
  }
};
// String
const getAudioAnalysisForTrack = async (context, track_id) => {
    try {
        let response = await context.state.spotifyApi.getAudioAnalysisForTrack(track_id);
        return response;
    } catch (error) {
        return;
    }
};
// {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
const getRecomendations = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getRecommendations(payload);
        return response;
    } catch (error) {
        return;
    }
};
// {limit: 1-50, offset: first index}
const getSavedTracks = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMySavedTracks({limit: payload.limit, offset: payload.offset});
        if (payload.offset == 0) {
            context.commit('setTotal', response.total);
        }
        return response.items;
    } catch (error) {
        return;
    }
};
// None
const getUser = async (context) => {
    try {
      if (context.state.inicialized)
      {
        let response = await context.state.spotifyApi.getMe();
        await context.commit('setUserData', response);
      }
    } catch (error) {
        return;
    }
};
// Array IDs
const searchSpotify = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
        return response;
    } catch (error) {
        return;
    }
};

const getArtistTopTracks = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getArtistTopTracks(id, "US", {});
        return response.tracks;
    } catch (error) {
        return;
    }
};



export default {
    inicializeGetToken,
    inicializeParseToken,
    inicializeSetToken,

    loadLibrary,
    retrieveSavedTracks,
    retrieveSavedArtists,
    updateTimelines,
    processAudioFeatures,
    retrieveTopCharts,

    convertTrackObject,
    convertArtistObject,
    generateGenre,

    bangerCalc,

    getTrack,
    getTracks,
    getArtist,
    getAlbum,
    getArtists,
    getArtistRelatedArtists,
    getPlaylists,
    getPlaylist,
    getTopTracks,
    getTopArtists,
    getRecentlyPlayed,
    getAudioFeaturesForTracks,
    getAudioFeaturesForTrack,
    getAudioAnalysisForTrack,
    getRecomendations,
    getSavedTracks,
    getUser,
    searchSpotify,
    getArtistTopTracks
};