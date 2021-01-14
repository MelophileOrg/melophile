import axios from 'axios';
import querystring from 'querystring';

import {
  AUTH_URL,
  SPOTIFY_SEARCH_ID,
  SPOTIFY_SEARCH_KEY,
} from process.env;

/**
 * Retrieves client credentials for search.
 *
 * @returns {string} Spotify access token
 */
export const getSearchCredentials = async () => {
  try {
    const data = {
      grant_type: 'client_credentials',
    };

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_SEARCH_ID}:${SPOTIFY_SEARCH_KEY}`).toString('base64')}`,
      },
    };

    const response = await axios.post(
      AUTH_URL,
      querystring.stringify(data),
      options,
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
