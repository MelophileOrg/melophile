<template>
  <div>
    <track-list
      :items="items"
      showArtists="separate"
      show-index
      show-image />
  </div>
</template>

<script>
import TrackList from '~/components/ui/music-ui/list/track-list';

export default {
  name: 'TopPlayedTracksPreview',
  components: {
    TrackList,
  },
  data: () => ({
    items: [],
  }),
  async fetch() {
    let response = await this.$axios.get('/api/charts/played/tracks/long_term/0/5');
    this.items = response.data;
  },
}
</script>
