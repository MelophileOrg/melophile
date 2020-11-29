/**
 * Parse Image
 *
 * @param {object} item Item to be parsed
 * @param {string} type Type of item
 * @returns {string} Image URL
 */
export default (item, type) => {
  if (type === 'track') {
    return item.album.images[0].url;
  } if ([
    'artist',
    'album',
    'playlist',
  ].includes(type)) {
    return item.images[0].url;
  }
  return null;
};
