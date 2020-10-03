import request from '../request';
import store from '@/store';

// store._modules.root.state.user.user.spotify.id

export default {
  getUser: function(id) {
    return request.get(`/profile/${id}`);
  },
  getTopPlayed: function(id, type, timeRange) {
    const me = store._modules.root.state.user.user.spotify.id;
    if (me === id) {
      return request.get(`/me/top/played/${type}/${timeRange}`);
    } else {
      return request.get(`/profile/${id}/top/played/${type}/${timeRange}`);
    }
  },
};