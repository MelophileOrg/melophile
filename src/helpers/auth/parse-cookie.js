import jsonwebtoken from 'jsonwebtoken';

import {
  SECRET,
} from '~config';

/**
 * Parse Cookie
 * Decodes cookie string
 *
 * @param {string} token Signed jsonwebtoken
 * @returns {JSON} Token contents
 */
export const parseCookie = (token) => jsonwebtoken.verify(token, SECRET);
