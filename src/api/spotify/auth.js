/* eslint-disable camelcase */
import request from '../request';

/**
 * Sends back authentication code from Spotify
 *
 * @param {object} payload Spotify authorization code data
 */
const callback = (payload) => {
  const redirect = window.location.href.includes('localhost') ? 'develop' : 'melophile';
  return request.get(`/auth/callback/${redirect}/${payload.code}/${payload.state}`);
};

/**
 * Checks for previous logins
 */
const checkLogin = () => request.get('/auth/');

/**
 * Requests Spotify Login URL
 */
const login = () => {
  const env = window.location.href.includes('localhost') ? 'develop' : 'melophile';
  return request.get(`/auth/login/${env}`);
};

/**
 * Ends current user session
 */
const logout = () => request.delete('/auth');

/**
 * Requests an access token refresh
 *
 * @param {string} refresh_token
 */
const refreshToken = (refresh_token) => request.get(`/auth/refresh_token?refresh_token=${refresh_token}`);

export default {
  callback,
  checkLogin,
  login,
  logout,
  refreshToken,
};
