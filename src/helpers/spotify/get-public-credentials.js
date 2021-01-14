import axios from 'axios';
import querystring from 'querystring';

import {
  AUTH_URL,
  SPOTIFY_PUB_ID,
  SPOTIFY_PUB_KEY,
} from process.env;

/**
 * Retrieves client credentials for public data.
 *
 * @returns {string} Spotify access token
 */
export const getPublicCredentials = async () => {
  try {
    const data = {
      grant_type: 'client_credentials',
    };

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_PUB_ID}:${SPOTIFY_PUB_KEY}`).toString('base64')}`,
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
