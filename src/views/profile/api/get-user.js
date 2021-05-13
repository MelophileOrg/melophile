import store from '@/store';
import api from '@/api';

export const getUser = async (id) => {
  const me = store._modules.root.state.user.user.spotify.id;
  if (me === id) {
    return store._modules.root.state.user.user;
  } else {
    const response = await api.spotify.profiles.getUser(this.$route.params.id);
    return response.data;
  }
}