import request from './request';

export default {
  /**
   * Checks for previous logins
   */
  checkLogin: function() {
    return request.get('/');
  },

  /**
   * Requests Spotify Login URL
   */
  login: function() {
    const isDev = true;
    return request.get(`login/${isDev ? 'develop' : 'melophile'}`);
  },

  /**
   * Sends back authentication code from Spotify
   * 
   * @param {object} payload Spotify authorization code data
   */
  callback: function(payload) {
    const isDev = true;
    const redirect = isDev ? 'develop' : 'melophile';
    return request.get(`callback/${redirect}/${payload.code}/${payload.state}`);
  },

  /**
   * Requests an access token refresh
   * 
   * @param {string} refresh_token 
   */
  refreshToken: function(refresh_token) {
    return request.get(`refresh_token?refresh_token=${refresh_token}`);
  },

  /**
   * Ends current user session
   */
  logout: function() {
    return request.delete('/');
  },
};