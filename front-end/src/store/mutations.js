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
const resetProgress = (state) => {
    state.progress.processed = 0;
    state.progress.tracks = false;
    state.progress.artists = false;
    state.progress.genres = false;
    state.progress.charts = false;
    state.progress.timelines = false;
};
// Number
const setTotal = (state, payload) => {
    state.progress.total= payload;
};
// None
const addProcessed = (state) => {
    state.progress.processed += 1;
};
// None
const setProgressTracks = (state) => {
    state.progress.tracks = true;
};
// None
const setProgressArtists = (state) => {
    state.progress.artists = true;
};
// None
const setProgressGenres = (state) => {
    state.progress.genres = true;
};
// None
const setProgressCharts = (state) => {
    state.progress.charts = true;
};
// None 
const setProgressTimelines = (state) => {
    state.progress.timelines = true;
};
////////////////////////////////////////////////////////////////
// DATA OBJECTS ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const pushTrack = (state, trackObject) => {
    state.tracks[trackObject.id] = trackObject;
};
const pushArtist = (state, artistObject) => {
    state.artists[artistObject.id] = artistObject;
};
const addTrackToArtist = (state, payload) => {
    if (!(state.artists[payload.id].tracks.includes(payload.track)))
        state.artists[payload.id].tracks.push(payload.track);
};
const pushGenre = (state, genreObject) => {
    state.genres[genreObject.name] = genreObject;
};
// {id: String, artist: String}
const addArtistToGenre = (state, payload) => {
    if (state.genres[payload.id].artists.includes(payload.artist)) 
        return;
    state.genres[payload.id].artists.push(payload.artist);
};
// id
const addGenreTrackNum = (state, payload) => {
    state.genres[payload.key].trackNum += payload.value;
};
////////////////////////////////////////////////////////////////
// TOP PLAYED TRACKS/ARTISTS ///////////////////////////////////
////////////////////////////////////////////////////////////////
//   0-short_term 1-medium_term 2-long_term
const setTopPlayedTracks = (state, payload) => {
    state.topPlayed.tracks = payload;
};
//   0-short_term 1-medium_term 2-long_term
const setTopPlayedArtists = (state, payload) => {
    state.topPlayed.artists = payload;
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
// {key: String, value: Number}
const addAudioFeatureValue = (state, payload) => {
    state.audioFeatures[payload.key].value += payload.value;
};
// {key: String, chart: String, index: Number, value: Array}
const spliceAudioFeatureExtremes = (state, payload) => {
    state.audioFeatures[payload.key][payload.chart].splice(payload.index, 0, payload.value);
    state.audioFeatures[payload.key][payload.chart] = state.audioFeatures[payload.key][payload.chart].slice(0, 25);
};
// {key: string, month: Number, value: Number}
const addAudioFeatureTimeline = (state, payload) => {
    while (state.audioFeatures[payload.key].timeline.length - 1 < payload.month) {
        state.audioFeatures[payload.key].timeline.push({value: 0, total: 0});
    }
    state.audioFeatures[payload.key].timeline[payload.month].value += payload.value;
    state.audioFeatures[payload.key].timeline[payload.month].total += 1;
};
//
const averageAudioFeatureValues = (state) => {
    let keys = Object.keys(state.audioFeatures);
    for (let i = 0; i < keys.length; i++) {
        state.audioFeatures[keys[i]].value /= state.progress.total;
        for (let j = 0; j < state.audioFeatures[keys[i]].timeline.length; j++) {
            state.audioFeatures[keys[i]].timeline[j].value /= state.audioFeatures[keys[i]].timeline[j].total;
        }
    }
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
//
const addMode = (state, payload) => {
    state.mode.value += payload;
};
const averageMode = (state) => {
    state.mode.value /= state.progress.total;
};
////////////////////////////////////////////////////////////////
// Timeline ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {key: string, month: Number, value: Number}
const addDateAddedTimeline = (state, month) => {
    while (state.dateAdded.length - 1 < month) {
        state.dateAdded.push(0);
    }
    state.dateAdded[month] += 1;
};
//
export default {
    setInicialized,
    setUserData,

    resetProgress,
    setTotal,
    addProcessed,
    setProgressTracks,
    setProgressArtists,
    setProgressGenres,
    setProgressCharts,
    setProgressTimelines,

    pushTrack,
    pushArtist,
    addTrackToArtist,
    pushGenre,
    addArtistToGenre,
    addGenreTrackNum,

    setTopPlayedTracks,
    setTopPlayedArtists,
    setTopSavedArtists,
    setTopSavedGenres,

    addAudioFeatureValue,
    spliceAudioFeatureExtremes,
    addAudioFeatureTimeline,
    averageAudioFeatureValues,
    plotAudioFeatureValue,
    addMode,
    averageMode,

    addDateAddedTimeline
};