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
            let parts = item.split('=');
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
    context.dispatch('getUser');
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
    await context.dispatch('retrieveTopPlayed');
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
        for (let i = 0; i < keys.length; i++) {
            await context.commit('averageAudioFeatureValue', keys[i]);
        }
        context.commit('setTracksLoaded');
    }
};
// Track Array
const processTracks = async (context, payload) => {
    let ids = await context.dispatch('inicialScanReduceIds', payload);
    let trackAudioFeatures = await context.dispatch('getAudioFeaturesForTracks', ids);
    for (let i = 0; i < trackAudioFeatures.length; i++) {
        trackAudioFeatures[i].banger = await context.dispatch('bangerCalc', {tempo: trackAudioFeatures[i].tempo, energy: trackAudioFeatures[i].energy, danceability: trackAudioFeatures[i].danceability})
    }
    await context.dispatch('distributeTrackAudioFeatures', trackAudioFeatures);
};
// Track Array
const inicialScanReduceIds = async (context, payload) => {
    let ids = [];
    let artistsToFind = [];
    let now = new Date();
    let nowTime = now.getTime();
    const MONTH = 2626560000;
    for (let i = 0; i < payload.length; i++) {
        let trackObject = payload[i].track;
        for (let j = 0; j < trackObject.artists.length; j++) {
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
    for (let i = 0; i < artists.length; i++) {
        let artistObject = artists[i];
        artistObject.href = artistObject.external_urls.spotify;
        delete artistObject.external_urls;
        artistObject.followers = artistObject.followers.total;
        for (let j = 0; j < artistObject.genres.length; j++) {
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
        banger: 0,
    };
    for (let i = 0; i < payload.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            values[keys[j]] += payload[i][keys[j]];
            context.commit('plotAudioFeatureValue', {key: keys[j], value: payload[i][keys[j]]})
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
            banger: payload[i].banger,
        }});
    }
    for (let i = 0; i < keys.length; i++) {
        await context.commit('addAudioFeatureValue', {key: keys[i], value: values[keys[i]]});
    }   
};
const calcTracksPerGenre = async (context) => {
    let artistIds = Object.keys(context.state.artists);
    for (let i = 0; i < artistIds.length; i++) {
        for (let j = 0; j < context.state.artists[artistIds[i]].genres.length; j++) {
            await context.commit('addGenreTrackNum', {id: context.state.artists[artistIds[i]].genres[j], value: context.state.artists[artistIds[i]].tracks.length});
        }
    }
    let genreTuples = Object.entries(context.state.genres);
    let topGenres = genreTuples.sort((a,b) => b[1].tracknum - a[1].tracknum).slice(0,5);
    let topGenreIds = topGenres.map(genre => genre[0]);
    context.commit('setTopSavedGenres', topGenreIds);
    let artistTuples = Object.entries(context.state.artists);
    let topArtists = artistTuples.sort((a,b) => b[1].tracks.length - a[1].tracks.length).slice(0,5);
    let topArtistIds = topArtists.map(artist => artist[0]);
    context.commit('setTopSavedArtists', topArtistIds);
    context.commit('setArtistsLoaded');
    context.commit('setGenresLoaded');
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
const retrieveTopPlayed = async (context) => {
    await context.dispatch('retrieveTopPlayedArtists');
    await context.dispatch('retrieveTopPlayedTracks');
};
const retrieveTopPlayedArtists = async (context) => {
    let ranges = ['short_term', 'medium_term', 'long_term'];
    for (let i = 0; i < ranges.length; i++) {
        let artists = await context.dispatch('getTopArtists', {limit: 50, time_range: ranges[i], offset: 0});
        let ids = [];
        for (let j = 0; j < artists.length; j++) {
            ids.push(artists[j].id);
            if (!(artists[j].id in context.state.artists)) {
                let artistObject = artists[j];
                artistObject.href = artistObject.external_urls.spotify;
                delete artistObject.external_urls;
                artistObject.followers = artistObject.followers.total;
                delete artistObject.type;
                delete artistObject.uri;
                context.commit('pushArtist', {id: artists[j].id, value: artistObject});
            }
        }
        context.commit('setTopPlayedArtists', {index: i, value: ids});
    }
};
const retrieveTopPlayedTracks = async (context) => {
    let ranges = ['short_term', 'medium_term', 'long_term'];
    for (let i = 0; i < ranges.length; i++) {
        let tracks = await context.dispatch('getTopTracks', {limit: 50, time_range: ranges[i], offset: 0});
        let ids = [];
        for (let j = 0; j < tracks.length; j++) {
            ids.push(tracks[j].id);
            if (!(tracks[j].id in context.state.tracks)) {
                let trackObject = tracks[j];
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
                context.commit('pushTrack', {id: tracks[j].id, value: trackObject});
            }
        }
        context.commit('setTopPlayedTracks', {index: i, value: ids});
    }
};
////////////////////////////////////////////////////////////////
// AUDIO FEATURES //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {tempo: Number, energy: Number, danceability: Number}
const bangerCalc = async (context, payload) => {
    return ((payload.tempo - 96 + (payload.energy * 100) + (payload.danceability*50)) / 210);
}
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
// {name: String, privacy: Boolean, include: Object}
// INCLUDE ITEM               KEY                        PUBLIC REQ
// Numerical Data: True.      numerical_data             True
// Most Saved Artists:        most_saved_artists         
// Audio Features: True.      audio_features             True
// Top Saved Genres:          most_saved_genres
// Numerical Features:        numerical_features
// Probability Features:      probability_features
// Date Added Timeline:       added_timeline
// Happiness Distribution:    happiness_distribution
// Energy Distribution:       energy_distribution
// Danceability Distribution: danceability_distribution
// Banger Distribution:       banger_distribution
// Standard Deviation Genre:  genre_standard_dev
// Top 30 Songs:              most_played_tracks          True
// Top 30 Artists:            most_played_artists         True
// Extremes Top 10:           extremes
const saveLibrary = async (context, payload) => {
    if (!payload.private && !payload.include.numerical_data && !payload.include.audio_features && !payload.include.most_played_tracks && !payload.include.most_played_artists)
        return false;
    let data = {};
    data.include = payload.include;
    data.name = payload.name;
    data.private = payload.private;
    data.tracks = await context.dispatch('convertTracks', payload.include);
    data.artists = await context.dispatch('convertArtists', payload.include);
    data.genres = await context.dispatch('convertGenres', payload.include);
    if (payload.include.numerical_data)
        data.numerical_data = {total: context.state.progress.total, artists: (Object.keys(context.state.artists)).length, genres: (Object.keys(context.state.genres)).length};
    if (payload.include.most_saved_artists || payload.include.most_saved_genres) {
        data.topSaved = {};
        if (payload.include.most_saved_artists)
            data.topSaved.artists = context.state.topSaved.artists;
        if (payload.include.most_saved_genres)
            data.topSaved.genres = context.state.topSaved.genres;
    }
    if (payload.include.most_played_tracks || payload.include.most_played_artists) {
        data.topPlayed = {};
        if (payload.include.most_played_tracks) 
            data.topPlayed.tracks = context.state.topPlayed.tracks;
        if (payload.include.most_played_artists) 
            data.topPlayed.artists = context.state.topPlayed.artists;
    }
    if (payload.include.audio_features || payload.include.numerical_features || payload.include.extremes || payload.include.probability_features) {
        data.audioFeatures = {
            acousticness: {},
            danceability: {},
            energy: {},
            instrumentalness: {},
            liveness: {},
            loudness: {},
            speechiness: {},
            tempo: {},
            valence: {},
            banger: {},
        };
        if (payload.include.audio_features) {
            data.audioFeatures.valence.value = context.state.audioFeatures.valence.value;
            data.audioFeatures.energy.value = context.state.audioFeatures.energy.value;
            data.audioFeatures.danceability.value = context.state.audioFeatures.danceability.value;
        }
        if (payload.include.probability_features) {
            data.audioFeatures.acousticness.value = context.state.audioFeatures.acousticness.value;
            data.audioFeatures.instrumentalness.value = context.state.audioFeatures.instrumentalness.value;
            data.audioFeatures.liveness.value = context.state.audioFeatures.liveness.value;
            data.audioFeatures.speechiness.value = context.state.audioFeatures.speechiness.value;
        }
        if (payload.include.extremes) {
            let keys = Object.keys(data.audioFeatures);
            let charts = ["minchart", "maxchart"]
            for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < charts.length; j++) {
                    data.audioFeatures[keys[i]][charts[j]] = context.state.audioFeatures[keys[i]][charts[j]];
                }
            }
        }
        if (payload.include.happiness_distribution) {
            data.audioFeatures.valence.plot = context.state.audioFeatures.valence.plot;
        }
        if (payload.include.energy_distribution) {
            data.audioFeatures.energy.plot = context.state.audioFeatures.energy.plot;
        }
        if (payload.include.danceability_distribution) {
            data.audioFeatures.danceability.plot = context.state.audioFeatures.danceability.plot;
        }
        if (payload.include.banger_distribution) {
            data.audioFeatures.banger.plot = context.state.audioFeatures.banger.plot;
        }
    }
    if (payload.include.added_timeline) 
        data.dateAdded = context.state.dateAdded;
    //if (payload.include.genre_standard_dev)
    console.log(data);
    return true;
};
// Include Object
const convertTracks = async (context, payload) => {
    let reqTracks = {};
    let addTracks = [];
    let repeats = 0;
    if (payload.most_played_tracks)
        addTracks = addTracks.concat(await context.dispatch('gatherMostPlayedTracks'));
    if (payload.extremes) 
        addTracks = addTracks.concat(await context.dispatch('gatherExtremes'));
    let nonRepeatedTracks = {};
    for (let i = 0; i < addTracks.length; i++) {
        if (!(addTracks[i] in nonRepeatedTracks))
            nonRepeatedTracks[addTracks[i]] = 0;
        else {
            nonRepeatedTracks[addTracks[i]] += 1;
            repeats += 1;
        }
    }
    console.log('%c Saved Track Space From ' + repeats + ' Repeats.', 'color: blue;');
    let ids = Object.keys(nonRepeatedTracks);
    for (let i = 0; i < ids.length; i++) {
        reqTracks[ids[i]] = await context.dispatch("compressTrack", context.state.tracks[ids[i]]);
    }
    return reqTracks;
};
// Nothing
const gatherMostPlayedTracks = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topPlayed.tracks.length; i++) {
        for (let j = 0; j < context.state.topPlayed.tracks[i].length && j < 20; j++) {
            ids.push(context.state.topPlayed.tracks[i][j]);
        }
    }
    return ids;
}
// Nothing
const gatherExtremes = async (context) => {
    let keys = Object.keys(context.state.audioFeatures);
    let charts = ["minchart", "maxchart"];
    let ids = [];
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < charts.length; j++) {
            for (let k = 0; k < context.state.audioFeatures[keys[i]][charts[j]].length && k < 10; k++) {
                ids.push(context.state.audioFeatures[keys[i]][charts[j]][k]);
            }
        }
    }
    return ids;
}
// Track object
const compressTrack = async (context, payload) => {
    return {name: payload.name, image: payload.album.images[0].url, artists: payload.artists};
};
// None
const convertArtists = async (context, payload) => {
    let reqArtists = {};
    let addArtists = [];
    let repeats = 0;
    if (payload.most_played_artists)
        addArtists = addArtists.concat(await context.dispatch('gatherMostPlayedArtists'));
    if (payload.most_saved_artists) 
        addArtists = addArtists.concat(await context.dispatch('gatherMostSavedArtists'));
    let nonRepeatedArtists = {};
    for (let i = 0; i < addArtists.length; i++) {
        if (!(addArtists[i] in nonRepeatedArtists))
            nonRepeatedArtists[addArtists[i]] = 0;
        else {
            nonRepeatedArtists[addArtists[i]] += 1;
            repeats += 1;
        }
    }
    console.log('%c Saved Artists Space From ' + repeats + ' Repeats.', 'color: blue;');
    let ids = Object.keys(nonRepeatedArtists);
    for (let i = 0; i < ids.length; i++) {
        reqArtists[ids[i]] = await context.dispatch("compressArtist", context.state.artists[ids[i]]);
    }
    return reqArtists;
};
// Nothing
const gatherMostPlayedArtists = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topPlayed.artists.length; i++) {
        for (let j = 0; j < context.state.topPlayed.artists[i].length && j < 20; j++) {
            ids.push(context.state.topPlayed.artists[i][j]);
        }
    }
    return ids;
};
// Nothing
const gatherMostSavedArtists = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topSaved.artists.length; i++) {
        ids.push(context.state.topSaved.artists[i]);
    }
    return ids;
};
// Track object
const compressArtist = async (context, payload) => {
    return {name: payload.name, image: payload.images[0].url, genres: payload.genres};
};
// Include Object
const convertGenres = async (context, payload) => {
    let reqGenres = {};
    if (payload.most_saved_genres) {
        for (let i = 0; i < context.state.topSaved.genres.length; i++) {
            reqGenres[context.state.topSaved.genres[i]] = context.state.genres[context.state.topSaved.genres[i]];
        }
    }
    return reqGenres;
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
        await context.commit('setUserData', response);
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
    retrieveTopPlayed,
    retrieveTopPlayedArtists,
    retrieveTopPlayedTracks,

    saveLibrary,
    convertTracks,
    gatherMostPlayedTracks,
    gatherExtremes,
    compressTrack,
    convertArtists,
    gatherMostPlayedArtists,
    gatherMostSavedArtists,
    compressArtist,
    convertGenres,

    bangerCalc,

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