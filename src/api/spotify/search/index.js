import request from '../request';

export default {
  generalQuery: function(query) {
    return request.get(`/search/${query}`);
  },
};