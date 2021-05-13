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
  name: 'TopPlayedArtistsPreview',
  components: {
    PreviewCarousel,
  },
  data: () => ({
    items: [],
  }),
  async created() {
    const response = await api.spotify.charts.topPlayed('artists', 'long_term', 0, 6);

    this.items = response.data;
  },
};
</script>
