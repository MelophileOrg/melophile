import request from '../request';

export default {
  playTrack: function({ uri }) {
    return request.get(`/player/track/${uri}`);
  },
  playContext: function({ uri }) {
    return request.get(`/player/context/${uri}`);
  },
};
