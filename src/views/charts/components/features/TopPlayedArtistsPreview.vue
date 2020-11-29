<template>
  <preview-carousel
    title="Top Played Artists"
    type="artist"
    :items="items" />
</template>

<script>
import api from '@/api';
import PreviewCarousel from '../ui/PreviewCarousel';

export default {
  name: 'TopPlayedTracksPreview',
  components: {
    PreviewCarousel,
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
