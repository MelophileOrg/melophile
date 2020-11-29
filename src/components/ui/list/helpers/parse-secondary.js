/**
 * Parse Secondary
 *
 * @param {object} item Item to be parsed
 * @param {string} type Type of item
 * @returns {Array} Secondary objects with ID if nessisary
 */
export default (item, type) => {
  if ([
    'track',
    'album',
  ].includes(type)) {
    return item.artists.map((artist) => ({ text: artist.name, id: artist.id }));
  } if (type === 'artist') {
    const formatedFollowers = item.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return [{ text: `${formatedFollowers} Followers`, id: item.id }];
  } if (type === 'playlist') {
    return [{ text: item.owner.display_name, id: item.owner.id }];
  }
  return [];
};
