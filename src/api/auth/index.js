import request from './request';

export default {
  checkLogin: function() {
    return request.get('/');
  },
  login: function() {
    const isDev = true;
    return request.get(`login/${isDev ? 'develop' : 'melophile'}`);
  },
  callback: function(payload) {
    const isDev = true;
    const redirect = isDev ? 'develop' : 'melophile';
    return request.get(`callback/${redirect}/${payload.code}/${payload.state}`);
  },
  refreshToken: function(refresh_token) {
    return request.get(`refresh_token?refresh_token=${refresh_token}`);
  },
};