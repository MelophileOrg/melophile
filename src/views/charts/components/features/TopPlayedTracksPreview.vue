<template>
  <preview-stubs
    title="Top Played Tracks"
    type="track"
    :items="items"
    :indexed="true" />
</template>

<script>
import api from '@/api';
import PreviewStubs from '../ui/PreviewStubs';

export default {
  name: 'TopPlayedTracksPreview',
  components: {
    PreviewStubs,
  },
  data: () => ({
    items: [],
  }),
  async created() {
    const response = await api.spotify.charts.topPlayed('tracks', 'long_term', 0, 9);

    this.items = response.data;
  },
};
</script>
