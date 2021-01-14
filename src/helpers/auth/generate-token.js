import jsonwebtoken from 'jsonwebtoken';

import {
  SECRET,
} from process.env;

/**
 * Generate Token
 * Returns signed Json Web Token.
 *
 * @param {object} data Data to be encoded.
 * @param {string} expires Expiration date of cookie.
 * @return {JSON} Web Token
 */
export const generateToken = (data, expires) => jsonwebtoken
  .sign(data, SECRET, { expiresIn: expires });
