import request from '../request';

export default {
  getArtist: function(id) {
    return request.get(`/artist/${id}`);
  },
};