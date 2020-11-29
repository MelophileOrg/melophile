export default (index, item, type) => {
  if ([
    'track',
    'album',
  ].includes(type)) {
    return `/artist/${item.artists[index].id}`;
  } if (type === 'playlist') {
    return `/user/${item.owner.id}`;
  }
};
