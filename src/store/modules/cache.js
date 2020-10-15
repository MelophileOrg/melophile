import api from '@/api';

const state = () => ({
  /**
   * Track object
   * 
   * @type {object}
   */
  track: null,

  /**
   * Track audio features object
   * 
   * @type {object}
   */
  audioFeatures: null,

  /**
   * Track audio analysis object
   * 
   * @type {object}
   */
  audioAnalysis: null,

  /**
   * Artist object
   * 
   * @type {object}
   */
  artist: null,

  /**
   * Album object
   * 
   * @type {object}
   */
  album: null,

  /**
   * User object
   * 
   * @type {object}
   */
  user: null,

  /**
   * Profile object
   * 
   * @type {object}
   */
  profile: null,

  /**
   * Playlist object
   * 
   * @type {object}
   */
  playlist: null,
});

const getters = {
  track: (state) => state.track,
  audioFeatures: (state) => state.audioFeatures,
  audioAnalysis: (state) => state.audioAnalysis,
  artist: (state) => state.artist,
  album: (state) => state.album,
  user: (state) => state.user,
  profile: (state) => state.profile,
  playlist: (state) => state.playlist,
};

const mutations = {
    setTrack(state, track) {
        state.track = track;
    },
    deleteTrack(state) {
        state.track = null;
    },
    setAudioFeatures(state, audioFeatures) {
        state.audioFeatures = audioFeatures;
    },
    deleteAudioFeatures(state) {
        state.audioFeatures = null;
    },
    setAudioAnalysis(state, audioAnalysis) {
        state.audioAnalysis = audioAnalysis;
    },
    deleteAudioAnalysis(state) {
        state.audioAnalysis = null;
    },
    setArtist(state, artist) {
        state.artist = artist;
    },
    deleteArtist(state) {
        state.artist = null;
    },
    setAlbum(state, album) {
        state.album = album;
    },
    deleteAlbum(state) {
        state.album = null;
    },
    setUser(state, user) {
        state.user = user;
    },
    deleteUser(state) {
        state.user = null;
    },
    setProfile(state, profile) {
        state.profile = profile;
    },
    deleteProfile(state) {
        state.profile = null;
    },
    setPlaylist(state, playlist) {
        state.playlist = playlist;
    },
    deletePlaylist(state) {
        state.play
    },
};

const actions = {
    async getTrack({ commit }, { id }) {
        let response = await api.spotify.tracks.getTrack(id);
        commit('setTrack', response.data);
    },
    deleteTrack({ commit }) {
        commit('deleteTrack');
    },
    async getAudioFeatures({ commit }, { id }) {
        let response = await api.spotify.tracks.getAudioFeatures(id);
        console.log(response);
        commit('setAudioFeatures', response.data);
    },
    async getAudioAnalysis({ commit }, { id }) {
        let response = await api.spotify.tracks.getAudioAnalysis(id);
        commit('setAudioAnalysis', response.data);
    },
    async getArtist({ commit }, { id }) {
        let response = await api.spotify.artists.getArtist(id);
        commit('setArtist', response.data);
    },
    async getAlbum({ commit }, { id }) {
        let response = await api.spotify.albums.getAlbum(id);
        commit('setAlbum', response.data);
    },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
