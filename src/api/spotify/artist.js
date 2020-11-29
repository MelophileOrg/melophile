import request from '../request';

const follow = (id) => request(`/artist/${id}/follow`);

const followed = (id) => request(`/artist/${id}/followed`);

const full = (id) => request(`/artist/${id}`);

const topPlayed = (timeRange) => request(`/me/top/played/artist/${timeRange}`);

const unfollow = (id) => request(`/artist/${id}/unfollow`);

export default {
  follow,
  followed,
  full,
  topPlayed,
  unfollow,
};
