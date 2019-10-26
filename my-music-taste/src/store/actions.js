////////////////////////////////////////////////////////////////
// INICIALIZATION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const inicializeGetToken = (context) => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
    let redirectUri = 'http://mymusic.andrewdanielyoung.com/redirect/';
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
    console.log('%c Parsing Token.', 'color: blue;');
    let token = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    context.dispatch('inicializeSetToken', token.access_token);
};
// Token
const inicializeSetToken = async (context, token) => {
    console.log('%c Inicializing Authorization.', 'color: purple;');
    await context.state.spotifyApi.setAccessToken(token);
    console.log('%c Application Authorized.', 'color: green;');
    await context.commit('setInicialized', true);
    //context.dispatch('getUser');
};
////////////////////////////////////////////////////////////////
// LOAD PROGRESS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const loadLibrary = async (context) => {
    console.log('%c Loading Library.', 'color: blue;');
    context.commit('resetProgress');
    await context.dispatch('retrieveSavedTracks', {limit: 50, offset: 0});
    console.log('%c Library Processing Finished.', 'color: green;');
    await context.dispatch('calcTracksPerGenre');
    await context.dispatch('calcExtremes');
};
// {limit: Number, offset: Number}
const retrieveSavedTracks = async (context, payload) => {
    console.log('%c Requesting Tracks. ' + context.state.progress.processed + "/" + context.state.progress.total, 'color: purple;');
    let response = await context.dispatch('getSavedTracks', {limit: payload.limit, offset: payload.offset});
    if (payload.offset == 0)
        context.commit('setTotal', response.total);
    await context.dispatch('processTracks', response.items);
    if (response.items.length == payload.limit)
        await context.dispatch('retrieveSavedTracks', {limit: 50, offset: payload.offset + payload.limit});
    else {
        let keys = Object.keys(context.state.audioFeatures);
        for (var i = 0; i < keys.length; i++) {
            await context.commit('averageAudioFeatureValue', keys[i]);
        }
        context.commit('setTracksLoaded');
    }
};
// Track Array
const processTracks = async (context, payload) => {
    let ids = await context.dispatch('inicialScanReduceIds', payload);
    let trackAudioFeatures = await context.dispatch('getAudioFeaturesForTracks', ids);
    await context.dispatch('distributeTrackAudioFeatures', trackAudioFeatures);
};
// Track Array
const inicialScanReduceIds = async (context, payload) => {
    let ids = [];
    let artistsToFind = [];
    let now = new Date();
    let nowTime = now.getTime();
    const MONTH = 2626560000;
    for (var i = 0; i < payload.length; i++) {
        let trackObject = payload[i].track;
        for (var j = 0; j < trackObject.artists.length; j++) {
            if (!(trackObject.artists[j].id in context.state.artists)) {
                if (!(trackObject.artists[j].id in artistsToFind))
                    artistsToFind.push({id: trackObject.artists[j].id, tracks: [trackObject.id]});
                else
                    artistsToFind[trackObject.artists[j].id].tracks.push(trackObject.id);
            }
            else
                context.commit('addTrackToArtist', {id: trackObject.artists[j].id, track: trackObject.id});
            trackObject.artists[j] = trackObject.artists[j].id;
        }
        trackObject.date = payload[i].added_at;
        let addedDate = new Date(trackObject.date);
        let addedDateTime = addedDate.getTime();
        context.commit('addDateAddedTrack', Math.floor((nowTime - addedDateTime) / MONTH));
        delete trackObject.album.album_type;
        delete trackObject.album.artists;
        delete trackObject.album.available_markets;
        delete trackObject.album.available_markets;
        trackObject.album.href = trackObject.album.external_urls.spotify;
        delete trackObject.album.type;
        delete trackObject.album.uri;
        delete trackObject.available_markets;
        delete trackObject.disc_number;
        delete trackObject.external_ids;
        trackObject.href = trackObject.external_urls.spotify;
        delete trackObject.external_urls;
        delete trackObject.type;
        delete trackObject.uri;
        ids.push(trackObject.id);
        context.commit('pushTrack', {id: trackObject.id, value: trackObject});
        context.commit('addProcessed');
    }
    await context.dispatch('findAndStoreArtists', artistsToFind);
    return ids;
};
// Array {id: String, tracks: [String]}
const findAndStoreArtists = async (context, payload) => {
    let ids = payload.map(artist => artist.id);
    let artists = [];
    while (ids.length > 0) {
        let sectionIds = ids.splice(0, 50);
        let newArtists = await context.dispatch('getArtists', sectionIds);
        artists = artists.concat(newArtists);
    }
    for (var i = 0; i < artists.length; i++) {
        let artistObject = artists[i];
        artistObject.href = artistObject.external_urls.spotify;
        delete artistObject.external_urls;
        artistObject.followers = artistObject.followers.total;
        for (var j = 0; j < artistObject.genres.length; j++) {
            if (!(artistObject.genres[j] in context.state.genres))
                await context.commit('pushGenre', {id: artistObject.genres[j], value: {name: artistObject.genres[j], artists: [artistObject.id], tracknum: 0}});
            else 
                await context.commit('addArtistToGenre', {id: artistObject.genres[j], artist: artistObject.id});
        }
        delete artistObject.type;
        delete artistObject.uri;
        artistObject.tracks = [];
        await context.commit('pushArtist', {id: artistObject.id, value: artistObject});
    }
};
// Audio Features Array
const distributeTrackAudioFeatures = async (context, payload) => {
    let keys = Object.keys(context.state.audioFeatures);
    let values = {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        liveness: 0,
        loudness: 0,
        speechiness: 0,
        valence: 0,
        tempo: 0,
    };
    for (let i = 0; i < payload.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            values[keys[j]] += payload[i][keys[j]];
        }
        await context.commit('addTrackProperties', {id: payload[i].id, properties: {
            danceability: payload[i].danceability,
            energy: payload[i].energy,
            key: payload[i].key,
            loudness: payload[i].loudness,
            mode: payload[i].mode,
            speechiness: payload[i].speechiness,
            acousticness: payload[i].acousticness,
            instrumentalness: payload[i].instrumentalness,
            liveness: payload[i].liveness,
            valence: payload[i].valence,
            tempo: payload[i].tempo,
            duration_ms: payload[i].duration_ms,
            time_signature: payload[i].time_signature,
        }});
    }
    for (let i = 0; i < keys.length; i++) {
        await context.commit('addAudioFeatureValue', {key: keys[i], value: values[keys[i]]});
    }   
};
const calcTracksPerGenre = async (context) => {
    let artistIds = Object.keys(context.state.artists);
    for (var i = 0; i < artistIds.length; i++) {
        for (var j = 0; j < context.state.artists[artistIds[i]].genres.length; j++) {
            await context.commit('addGenreTrackNum', {id: context.state.artists[artistIds[i]].genres[j], value: context.state.artists[artistIds[i]].tracks.length});
        }
    }
    let genreTuples = Object.entries(context.state.genres);
    let topGenres = genreTuples.sort((a,b) => b[1].tracknum - a[1].tracknum).slice(0,50);
    let topGenreIds = topGenres.map(genre => genre[0]);
    context.commit('setTopSavedGenres', topGenreIds);

    let artistTuples = Object.entries(context.state.artists);
    let topArtists = artistTuples.sort((a,b) => b[1].tracks.length - a[1].tracks.length).slice(0,50);
    let topArtistIds = topArtists.map(artist => artist[0]);
    context.commit('setTopSavedArtists', topArtistIds);

    context.commit('setArtistsLoaded');
};
const calcExtremes = async (context) => {
    let keys = Object.keys(context.state.audioFeatures);
    let trackTuples = Object.entries(context.state.tracks);
    let charts = ["minchart", "maxchart"];
    let topTracks;
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < charts.length; j++) {
            if (charts[j] == "minchart") {
                topTracks = trackTuples.sort((a,b) => a[1][keys[i]] - b[1][keys[i]]).slice(0,25);
            }
            else {
                topTracks = trackTuples.sort((a,b) => b[1][keys[i]] - a[1][keys[i]]).slice(0,25);
            }
            let topTracksIds = topTracks.map(track => track[0]);
            context.commit('setAudioFeatureChart', {key: keys[i], chart: [charts[j]], value: topTracksIds});
        }
    }
    
    
};
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
// SAVE LIBRARY ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {name: String, privacy: Boolean, include: Array}
const saveLibrary = async (context, payload) => {
    let data = {};
    data.tracks = await context.dispatch('saveTracks', payload.include);
};
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
        let response = await context.state.spotifyApi.getMyTopArtists({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        console.log(error);
    } 
};
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopTracks = async (context, payload) => {
    try {
        console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
        let response = await context.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        console.log(error);
    }  
};
// {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds
const getRecentlyPlayed = async (context, payload) => {
    try {
        console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
        let response = await context.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
        return response;
    } catch (error) {
        console.log(error);
    }
};
const getTrack = async (context, track_id) => {
  try {
      console.log('%c Requesting Song Data.', 'color: blue;');
      let response = await context.state.spotifyApi.getTrack(track_id);
      return response;
  } catch (error) {
      console.log(error);
  }
};
const getTracks = async (context, track_ids) => {
  try {
      console.log('%c Requesting Songs Data.', 'color: blue;');
      let response = await context.state.spotifyApi.getTracks(track_ids);
      return response;
  } catch (error) {
      console.log(error);
  }
};
// {artistId: String}
const getArtist = async (context, id) => {
    try {
        console.log('%c Requesting Artist.', 'color: blue;');
        let response = await context.state.spotifyApi.getArtist(id);
        return response;
    } catch (error) {
        console.log(error);
    }
}; 
// []
const getArtists = async (context, ids) => {
  try {
      console.log('%c Requesting Artists.', 'color: blue;');
      let response = await context.state.spotifyApi.getArtists(ids);
      return response.artists;
  } catch (error) {
      console.log(error);
  }
};
// Array IDs
const getAudioFeaturesForTracks = async (context, track_ids) => {
    try {
        console.log('%c Requesting Song Data.', 'color: blue;');
        let response = await context.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
        return response.audio_features;
    } catch (error) {
        console.log(error);
    }
};
const getAudioFeaturesForTrack = async (context, track_id) => {
  try {
      console.log('%c Requesting Song Analysis.', 'color: blue;');
      let response = await context.state.spotifyApi.getAudioFeaturesForTracks([track_id]);
      return response.audio_features[0];
  } catch (error) {
      console.log(error);
  }
};
const getAudioAnalysisForTrack = async (context, track_id) => {
    try {
        console.log('%c Requesting Audio Analysis.', 'color: blue;');
        let response = await context.state.spotifyApi.getAudioAnalysisForTrack(track_id);
        return response;
    } catch (error) {
        console.log(error);
    }
};
// {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
const getRecomendations = async (context, payload) => {
    try {
        console.log('%c Requesting Recommendations.', 'color: blue;');
        let response = await context.state.spotifyApi.getRecommendations(payload);
        return response;
    } catch (error) {
        console.log(error);
    }
};
// {limit: 1-50, offset: first index}
const getSavedTracks = async (context, payload) => {
    try {
        console.log('%c Requesting Library Data. ' + payload.offset + '-' + (payload.offset + payload.limit), 'color: blue;');
        let response = await context.state.spotifyApi.getMySavedTracks({limit: payload.limit, offset: payload.offset});
        return response;
    } catch (error) {
        console.log(error);
    }
};
// None
const getUser = async (context) => {
    try {
      if (context.state.inicialized)
      {
        console.log('%c Requesting user Data.', 'color: blue;');
        let response = await context.state.spotifyApi.getMe();
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
        let response = await context.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
        return response.tracks.items;
    } catch (error) {
        console.log(error);
    }
};
  
export default {
    inicializeGetToken,
    inicializeParseToken,
    inicializeSetToken,

    loadLibrary,
    retrieveSavedTracks,
    processTracks,
    inicialScanReduceIds,
    findAndStoreArtists,
    distributeTrackAudioFeatures,
    calcTracksPerGenre,
    calcExtremes,

    saveLibrary,

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