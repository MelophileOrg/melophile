import api from '@/api';
// import router from '@/router';

const state = () => ({
  /**
   * Searched query
   * 
   * @type {string}
   */
  query: '',

  /**
   * Current displayed result's query
   * 
   * @type {string}
   */
  displayed: '',

  /**
   * Array of full track objects
   * 
   * @type {Array<object>}
   */
  tracks: [],

  /**
   * Array of full artist objects
   * 
   * @type {Array<object>}
   */
  artists: [],

  /**
   * Array of full album objects
   * 
   * @type {Array<object>}
   */
  albums: [],

  /**
   * Array of full playlist objects
   * 
   * @type {Array<object>}
   */
  playlists: [],

  /**
   * Array of full user objects
   * 
   * @type {Array<object>}
   */
  users: [],
});

const getters = {
  /**
   * Searched query
   * 
   * @type {string}
   */
  query: (state) => state.query,

  /**
   * Current displayed result's query
   * 
   * @type {string}
   */
  displayed: (state) => state.displayed,

  /**
   * Returns currently stored tracks
   * 
   * @type {Array<object>}
   */
  tracks: (state) => state.tracks,

  /**
   * Returns currently stored albums
   * 
   * @type {Array<object>}
   */
  albums: (state) => state.albums,

  /**
   * Returns currently stored artists
   * 
   * @type {Array<object>}
   */
  artists: (state) => state.artists,

  /**
   * Returns currently stored playlists
   * 
   * @type {Array<object>}
   */
  playlists: (state) => state.playlists,
};

const mutations = {
  /**
   * Changes query with form input
   * 
   * @param {object} state Vuex state
   * @param {string} query Input query
   */
  setQuery(state, query) {
    state.query = query;
  },

  /**
   * Declares query for requested data.
   * 
   * @param {object} state Vuex state
   */
  setDisplayed(state) {
    state.displayed = state.query;
  },

  /**
   * Loads track data into state
   * 
   * @param {object} state Vuex state
   * @param {Array<object>} tracks Track data objects
   */
  setTracks(state, tracks) {
    state.tracks = tracks;
  },

  /**
   * Loads album data into state
   * 
   * @param {object} state Vuex state
   * @param {Array<object>} albums Album data objects
   */
  setAlbums(state, albums) {
    state.albums = albums;
  },

  /**
   * Loads artist data into state
   * 
   * @param {object} state Vuex state
   * @param {Array<object>} artists Artist data objects
   */
  setArtists(state, artists) {
    state.artists = artists;
  },

  /**
   * Loads playlist data into state
   * 
   * @param {object} state Vuex state
   * @param {Array<object>} playlists Playlist data objects
   */
  setPlaylists(state, playlists) {
    state.playlists = playlists;
  },

  /**
   * Loads user data into state
   * 
   * @param {object} state Vuex state
   * @param {Array<object>} users User data objects
   */
  setUsers(state, users) {
    state.users = users;
  },
};

const actions = {
  /**
   * Search
   * Searches Spotify with the given query.
   * 
   * @param {VuexContext} context Vuex context object 
   */
  async search({ state, commit }) {
    if (state.query !== state.displayed) {
      commit('setDisplayed');
      const response = await api.spotify.search.generalQuery(state.query);
      commit('setTracks', response.data.tracks);
      commit('setAlbums', response.data.albums);
      commit('setArtists', response.data.artists);
      commit('setPlaylists', response.data.playlists);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
