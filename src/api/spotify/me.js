import request from '../request';

const topPlayed = (type = 'tracks', timeRange = 'long_term', limit = 50) => request(`/me/top/played/${type}/${timeRange}/${limit}`);

const topSaved = (type = 'tracks', limit = 50) => request(`/me/top/saved/${type}/${limit}`);

const extremes = (feature = 'valence', sort = 'max', limit = 50) => request(`/me/extreme/${feature}/${sort}/${limit}`);

export default {
  topPlayed,
  topSaved,
  extremes,
};
