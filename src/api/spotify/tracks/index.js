import request from '../request';

export default {
  getTrack: function(id) {
    return request.get(`/track/${id}`);
  },
};