import request from '../request';

const audioAnalysis = (id) => request(`/track/${id}/analysis`);

const audioFeatures = (id) => request(`/track/${id}/features`);

const full = (id) => request(`/track/${id}`);

const isLiked = (id) => request(`/track/${id}/liked`);

const like = (id) => request(`/track/${id}/like`);

const topPlayed = (timeRange) => request(`/me/top/played/track/${timeRange}`);

const unlike = (id) => request(`/track/${id}/unlike`);

export default {
  audioAnalysis,
  audioFeatures,
  full,
  isLiked,
  like,
  topPlayed,
  unlike,
};
