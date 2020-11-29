import request from '../request';

const search = (query, type, offset, limit) => request(`/search/${query}/${type}/${offset}/${limit}`);

export default {
  search,
};
