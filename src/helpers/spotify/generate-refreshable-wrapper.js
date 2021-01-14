import RefreshableWrapper from './refreshable-wrapper';

/**
 * Returns an authorized instance of a Spotify API wrapper
 *
 * @param {string} accessToken Spotify authorization code
 * @returns {Wrapper} Authorized Spotify wrapper
 */
export const generateRefreshableWrapper = (accessToken, refreshToken) => {
  const wrapper = new RefreshableWrapper();
  wrapper.setAccessToken(accessToken);
  wrapper.setRefreshToken(refreshToken);

  return wrapper;
};
