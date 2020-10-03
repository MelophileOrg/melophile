import request from '../request';

export default {
  getAlbum: function(id) {
    return request.get(`/album/${id}`);
  },
};