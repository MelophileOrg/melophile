/**
 * Finds image URL for item based on type
 *
 * @param {object} item Track, artist, album, playlist or user object
 */
export default function parseImage(item) {
  if (item.type === 'track') {
    return item.album.images[0].url;
  } if ([
    'artist',
    'album',
    'playlist',
    'user',
  ].includes(item.type)) {
    return item.images[0].url;
  }
  return null;
}
