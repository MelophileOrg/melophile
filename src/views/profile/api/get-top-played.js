import api from '@/api';

export const getTopPlayed = async (id, type, timeRange) => {
  const response = await api.spotify.profiles.getTopPlayed(id, type, timeRange);
  return response.data;
};
