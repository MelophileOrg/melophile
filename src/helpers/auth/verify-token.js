import jsonwebtoken from 'jsonwebtoken';

import { generateRefreshableWrapper } from '~helpers';
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
export const verify = async (req, res, next) => {
  try {
    const token = req.cookies['melophile-token'];

    if (!token) {
      return res.status(204).send('No Token Provided');
    }

    const {
      accessToken,
      spotifyID,
      refreshToken,
    } = jsonwebtoken.verify(token, SECRET);

    req.userID = spotifyID;
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;
    req.spotifyAPI = generateRefreshableWrapper(accessToken, refreshToken);

    next();
  } catch (error) {
    console.log(error);
    return res.status(204).send('Failed to authenticate token');
  }
};
