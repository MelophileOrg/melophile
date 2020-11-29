import request from '../request';

const full = (id) => request(`/album/${id}`);

const isLiked = (id) => request(`/album/${id}/liked`);

const like = (id) => request(`/album/${id}/like`);

const tracks = (id) => request(`/album/${id}/tracks`);

const unlike = (id) => request(`/album/${id}/unlike`);

export default {
  full,
  isLiked,
  like,
  tracks,
  unlike,
};
