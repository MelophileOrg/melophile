////////////////////////////////////////////////////////////////
// INICIALIZATION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Boolean
const setInicialized = (state, payload) => {
    state.inicialized = payload;
};
// Object
const setUserData = (state, payload) => {
    state.user = payload;
};
////////////////////////////////////////////////////////////////
// PROGRESS ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Number
const setTotal = (state, payload) => {
    state.progress.total= payload;
};
// None
const addProcessed = (state) => {
    state.progress.processed += 1;
};
const setTracksLoaded = (state) => {
    state.progress.tracksLoaded = true;
};
const setArtistsLoaded = (state) => {
    state.progress.artistsLoaded = true;
};
const setGenresLoaded = (state) => {
    state.progress.genresLoaded = true;
};
const resetProgress = (state) => {
    state.progress.processed = 0;
    state.progress.tracksLoaded = true;
    state.progress.genresLoaded = true;
    state.progress.genresLoaded = true;
};
////////////////////////////////////////////////////////////////
// DATA OBJECTS ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {id: String, value: Object}
const pushTrack = (state, payload) => {
    state.tracks[payload.id] = payload.value;
};
// {id: String, properties: Object}
const addTrackProperties = (state, payload) => {
    let keys = Object.keys(payload.properties);
    for (var i = 0; i < keys.length; i++) {
        state.tracks[payload.id][keys[i]] = payload.properties[keys[i]];
    }
};
// {id: String, value: Object}
const pushArtist = (state, payload) => {
    state.artists[payload.id] = payload.value;
};
// {id: String, track: String}
const addTrackToArtist = (state, payload) => {
    if (!(state.artists[payload.id].tracks.includes(payload.track)))
        state.artists[payload.id].tracks.push(payload.track);
};
// {id: String, value: Object}
const pushGenre = (state, payload) => {
    state.genres[payload.id] = payload.value;
};
// {id: String, artist: String}
const addArtistToGenre = (state, payload) => {
    if (state.genres[payload.id].artists.includes(payload.artist)) 
        return;
    state.genres[payload.id].artists.push(payload.artist);
};
// {id: String, value: Number}
const addGenreTrackNum = (state, payload) => {
    state.genres[payload.id].tracknum += payload.value;
};
////////////////////////////////////////////////////////////////
// TOP PLAYED TRACKS/ARTISTS ///////////////////////////////////
////////////////////////////////////////////////////////////////
// {index: Number, value: Object}   0-short_term 1-medium_term 2-long_term
const setTopPlayedTracks = (state, payload) => {
    state.topPlayed.tracks[payload.index] = payload.value;
};
// {index: Number, value: Object}   0-short_term 1-medium_term 2-long_term
const setTopPlayedArtists = (state, payload) => {
    state.topPlayed.artists[payload.index] = payload.value;
};
////////////////////////////////////////////////////////////////
// TOP SAVED TRACKS/ARTISTS ////////////////////////////////////
////////////////////////////////////////////////////////////////
// Array
const setTopSavedArtists = (state, payload) => {
    state.topSaved.artists = payload;
};
// Array
const setTopSavedGenres = (state, payload) => {
    state.topSaved.genres = payload;
};
////////////////////////////////////////////////////////////////
// AUDIO FEATURES //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {key: String, chart: String, value: Array}
const setAudioFeatureChart = (state, payload) => {
    state.audioFeatures[payload.key][payload.chart] = payload.value;
};
// {key: String, value: Number}
const addAudioFeatureValue = (state, payload) => {
    state.audioFeatures[payload.key].value += payload.value;
};
// Key String
const averageAudioFeatureValue = (state, key) => {
    state.audioFeatures[key].value /= state.progress.total;
};
// {key: String, value: Number}
const plotAudioFeatureValue = (state, payload) => {
    let index = Math.floor(payload.value * 10);
    if (index < 0)
        index = 0;
    if (index > 9) 
        index = 0;
    state.audioFeatures[payload.key].plot[index] += 1;
};
const addMode = (state, payload) => {
    state.mode.value += payload;
};
const averageMode = (state) => {
    state.mode.value /= state.progress.total;
};
////////////////////////////////////////////////////////////////
// DATES ADDED /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Number (Month)
const addDateAddedTrack = (state, payload) => {
    if (payload > (state.dateAdded.length - 1)) {
        for (var i = 0; i < (payload - (state.dateAdded.length - 1)); i++) {
            state.dateAdded.push(0);
        }
        state.dateAdded.push(0);
    }
    state.dateAdded[payload] += 1;
};
// Number (Month)
const addDateAddedArtist = (state, payload) => {
    if (payload > (state.artistAdded.length - 1)) {
        for (var i = 0; i < (payload - (state.artistAdded.length - 1)); i++) {
            state.artistAdded.push(0);
        }
    }
    state.artistAdded[payload] += 1;
};
// Number (Month)
const addDateAddedGenre = (state, payload) => {
    if (payload > (state.genreAdded.length - 1)) {
        for (var i = 0; i < (payload - (state.genreAdded.length - 1)); i++) {
            state.genreAdded.push(0);
        }
    }
    state.genreAdded[payload] += 1;
};
// Number (Month)
const addDateAddedAudioFeature = (state, payload) => {
    if (payload > (state.audioFeatureAdded.length - 1)) {
        for (var i = 0; i < (payload - (state.audioFeatureAdded.length - 1)); i++) {
            state.audioFeatureAdded.push(0);
        }
    }
    state.audioFeatureAdded[payload] += 1;
};
////////////////////////////////////////////////////////////////
// SOCIAL MUTATIONS/////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Array
const setPublicProfiles = (state, payload) => {
    state.publicProfiles = payload;
};
// Data Object
const setProfileData = (state, payload) => {
    state.profileData = payload;
};
export default {
    setInicialized,
    setUserData,
    
    setTotal,
    addProcessed,
    setTracksLoaded,
    setArtistsLoaded,
    setGenresLoaded,
    resetProgress,

    pushTrack,
    addTrackProperties,
    pushArtist,
    addTrackToArtist,
    pushGenre,
    addArtistToGenre,
    addGenreTrackNum,

    setTopPlayedTracks,
    setTopPlayedArtists,

    setTopSavedArtists,
    setTopSavedGenres,

    setAudioFeatureChart,
    addAudioFeatureValue,
    averageAudioFeatureValue,
    plotAudioFeatureValue,
    addMode,
    averageMode,

    addDateAddedTrack,
    addDateAddedArtist,
    addDateAddedGenre,
    addDateAddedAudioFeature,

    setPublicProfiles,
    setProfileData
};