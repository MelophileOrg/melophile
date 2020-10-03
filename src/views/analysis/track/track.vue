<template>
  <two-column-layout>
    <template v-slot:header>
      <track-header :track="track" />
    </template>

    <template v-slot:aside>
      <track-artist :artist="artist" />

      <track-album :album="album" />
    </template>

    <template v-slot:content>

    </template>
  </two-column-layout>
</template>

<script>
import api from '@/api';
import TrackAlbum from '@/views/analysis/track/components/album.vue';
import TrackArtist from '@/views/analysis/track/components/artist.vue';
import TrackHeader from '@/views/analysis/track/components/header.vue';
import TwoColumnLayout from '@/components/layout/two-column-layout.vue';

export default {
  name: 'AnalysisTrack',
  components: {
    TrackAlbum,
    TrackArtist,
    TrackHeader,
    TwoColumnLayout,
  },
  data: () => ({
    track: null,
    artist: null,
    album: null,
  }),
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    let response = await api.spotify.tracks.getTrack(this.id);
    this.track = response.data;
    response = await api.spotify.artists.getArtist(this.track.artists[0].id);
    this.artist = response.data;
    response = await api.spotify.albums.getAlbum(this.track.album.id);
    this.album = response.data;
    console.log(this.album);
  },
}
</script>
