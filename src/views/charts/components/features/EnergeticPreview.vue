<template>
  <preview-list
    title="Most Energetic Tracks"
    type="track"
    :items="items" />
</template>

<script>
import api from '@/api';
import PreviewList from '../ui/PreviewList';

export default {
  name: 'EnergeticPreview',
  components: {
    PreviewList,
  },
  data: () => ({
    items: [],
  }),
  async created() {
    const response = await api.spotify.me.topPlayed('artists', 'long_term', 6);

    this.items = response.data;
  },
};
</script>
