import jsonwebtoken from 'jsonwebtoken';

import { generateRefreshableWrapper } from '~helpers';
import { refreshToken } from '~services/auth/refresh-token';
import {
  SECRET,
} from '~config';

/**
 * Verfiy Incoming Token
 * Middleware continues to next function
 *
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {function} next Callback upon completion
 */
export const verifyAndRefresh = async (req, res, next) => {
  const token = req.cookies['melophile-token'];

  if (!token) {
    return res.status(204).send('No Token Provided');
  }

  try {
    const {
      spotifyID,
      refreshToken: oldRefreshToken,
    } = jsonwebtoken.verify(token, SECRET);

    const {
      status,
      data,
    } = await refreshToken(oldRefreshToken);

    if (status === 200) {
      const {
        access_token,
      } = data;

      req.userID = spotifyID;
      req.accessToken = access_token;
      req.refreshToken = oldRefreshToken;
      req.spotifyAPI = generateRefreshableWrapper(access_token, oldRefreshToken);

      next();
    } else {
      return res.status(204).send('Failed to refresh token');
    }
  } catch (error) {
    console.log(error);
    return res.status(204).send('Failed to authenticate token');
  }
};
