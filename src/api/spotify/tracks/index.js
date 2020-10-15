import request from '../request';

export default {
  getTrack: function(id) {
    return request.get(`/track/${id}`);
  },
  getAudioFeatures: function(id) {
    return request.get(`/track/${id}/features`);
  },
  getAudioAnalysis: function(id) {
    return request.get(`/track/${id}/analysis`);
  },
  isLiked: function(id) {
    return request.get(`/track/${id}/liked`);
  },
  like: function(id) {
    return request.get(`/track/${id}/like`);
  },
  unlike: function(id) {
    return request.get(`/track/${id}/unlike`);
  },
};