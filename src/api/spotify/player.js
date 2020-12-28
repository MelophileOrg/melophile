import request from '../request';

const getCurrentPlayback = () => request.get('/player');

const getUserDevices = () => request.get('/player/devices');

const next = (device_id) => request.post('/player/next', {
  device_id,
});

const pause = (device_id) => request.put('/player/pause', {
  device_id,
});

const play = (context_uri, offset = 0, uris) => request({
  method: 'put',
  url: '/player/play',
  data: {
    offset,
    uris,
    ...(context_uri && { context_uri }),
  },
});

const previous = (device_id) => request.post('/player/previous', {
  device_id,
});

const repeat = (state, device_id) => request({
  method: 'put',
  url: '/player/repeat',
  params: {
    state,
    device_id,
  },
});

const seekToPosition = (position_ms, device_id) => request({
  method: 'put',
  url: '/player/seek',
  params: {
    position_ms,
    device_id,
  },
});

const shuffle = (state, device_id) => request({
  method: 'put',
  url: '/player/shuffle',
  params: {
    state: !state,
    device_id,
  },
});

const transferUsersPlayback = (device_id, startPlaying = true) => {
  request({
    method: 'put',
    url: `/player/device/${device_id}/${startPlaying}`,
  });
};

const volume = (volume_percent, device_id) => request({
  method: 'put',
  url: '/player/volume',
  params: {
    volume_percent,
    device_id,
  },
});

export default {
  getCurrentPlayback,
  getUserDevices,
  next,
  pause,
  play,
  previous,
  repeat,
  seekToPosition,
  shuffle,
  transferUsersPlayback,
  volume,
};
