import dotenv from 'dotenv';

dotenv.config();

const {
  SPOTIFY_PRIV_ID,
  SPOTIFY_PRIV_KEY,
} = process.env;

export default authHeaders = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${SPOTIFY_PRIV_ID}:${SPOTIFY_PRIV_KEY}`).toString('base64')}`,
  },
};
