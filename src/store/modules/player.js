import api from '@/api';

const moduleState = {
  /**
   * Current Device ID
   *
   * @type {string}
   */
  deviceID: null,

  /**
   * Playback information
   *
   * @type {object}
   */
  playback: null,

  /**
   * Playing Context
   *
   * @type {object}
   */
  playbackContext: null,
};

const moduleGetters = {
  /**
   * Current Device ID
   *
   * @type {string}
   */
  deviceID: (state) => state.deviceID,

  /**
   * Playback information
   *
   * @type {object}
   */
  playback: (state) => state.playback,

  /**
   * Playing Context
   *
   * @type {object}
   */
  playbackContext: (state) => state.playbackContext,

  /**
   * Playing Track
   *
   * @type {object}
   */
  track: (state) => {
    if (state.playback && state.playback.is_playing) {
      return state.playbackContext.track_window.current_track;
    }
    return null;
  },

  /**
   * Is Currently Playing
   *
   * @type {boolean}
   */
  isPlaying: (state) => {
    if (state.playback) {
      return state.playback.is_playing;
    }
  },

  volumePercent: (state) => {
    if (state.playback) {
      return state.playback.device.volume_percent;
    }
  },

  progress: (state) => {
    if (state.playback) {
      return state.playbackContext.track_window.current_track.duration_ms / state.playback.progress_ms;
    }
  },
};

const moduleMutations = {
  setDeviceID(state, deviceID) {
    state.deviceID = deviceID;
  },
  setPlayback(state, playback) {
    state.playback = playback;
  },
  setPlaybackContext(state, playback) {
    state.playbackContext = playback;
  },
};

const moduleActions = {
  /**
   * Inicialize Spotify Web Player
   */
  init: async ({ commit, rootGetters, dispatch }) => {
    window.onSpotifyWebPlaybackSDKReady = () => {};

    async function waitForSpotifyWebPlaybackSDKToLoad() {
      return new Promise((resolve) => {
        if (window.Spotify) {
          resolve(window.Spotify);
        } else {
          window.onSpotifyWebPlaybackSDKReady = () => {
            resolve(window.Spotify);
          };
        }
      });
    }

    async function waitUntilUserHasSelectedPlayer(sdk) {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          const state = await sdk.getCurrentState();
          if (state !== null) {
            resolve(state);
            clearInterval(interval);
          }
        });
      });
    }

    (async () => {
      const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
      const token = rootGetters['user/accessToken'];

      const player = new Player({
        name: 'Melophile',
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('initialization_error', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('authentication_error', message);
        // dispatch('auth/login', null, { root: true });
      });

      player.addListener('account_error', ({ message }) => {
        console.error('account_error', message);
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('playback_error', message);
      });

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        if (state) {
          dispatch('setPlaybackContext', state);
          dispatch('setPlayback');
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        commit('setDeviceID', device_id);

        api.spotify.player.transferUsersPlayback(device_id, true);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      const connected = await player.connect();

      if (connected) {
        await waitUntilUserHasSelectedPlayer(player);
      }
    })();
  },

  async setPlayback({ commit }) {
    try {
      const response = await api.spotify.player.getCurrentPlayback();
      commit('setPlayback', response.data);
    } catch (e) {
      console.log(e);
    }
  },

  setPlaybackContext({ commit }, context) {
    commit('setPlaybackContext', context);
  },
};

const module = {
  namespaced: true,
  state: moduleState,
  getters: moduleGetters,
  mutations: moduleMutations,
  actions: moduleActions,
};

export default module;
