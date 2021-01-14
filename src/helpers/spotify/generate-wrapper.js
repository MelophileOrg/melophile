import { Wrapper } from 'enhanced-spotify-api';

/**
 * Returns an authorized instance of a Spotify API wrapper
 *
 * @param {string} accessToken Spotify authorization code
 * @returns {Wrapper} Authorized Spotify wrapper
 */
export const generateWrapper = (accessToken) => {
  const wrapper = new Wrapper();
  wrapper.setAccessToken(accessToken);

  return wrapper;
};
