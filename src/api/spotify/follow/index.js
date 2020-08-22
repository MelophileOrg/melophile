import request from '../request';

export default {
  getExample: function() {
    return request.get('example');
  },
};