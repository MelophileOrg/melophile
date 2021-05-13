import request from '../request';

const topPlayed = (type = 'tracks', timeRange = 'long_term', offset = 0, limit = 50) => request(`/charts/played/${type}/${timeRange}/${offset}/${limit}`);

const topSaved = (type = 'tracks', offset = 0, limit = 50) => request(`/charts/saved/${type}/${offset}/${limit}`);

const extremes = (feature = 'valence', sort = 'max', offset = 0, limit = 50) => request(`/charts/extreme/${feature}/${sort}/${offset}/${limit}`);

export default {
  topPlayed,
  topSaved,
  extremes,
};
