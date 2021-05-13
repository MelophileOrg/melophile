<template>
  <two-column-layout :aside-width="20">
    <template v-slot:header>
      <track-header
        v-model="tab"
        :track="track" />
    </template>

    <template v-slot:aside>
      <track-album
        :class="$style.album"
        :album="album" />

      <track-artist
        :class="$style.artist"
        :artist="artist" />
    </template>

    <template v-slot:content>

    </template>
  </two-column-layout>
</template>

<script>
import {
  mapGetters,
  mapActions,
} from 'vuex';
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
    tab: 0,
  }),
  computed: {
    ...mapGetters('cache', [
      'track',
      'audioFeatures',
      'audioAnalysis',
      'artist',
      'album',
    ]),
    id() {
      return this.$route.params.id;
    },
  },
  watch: {
    track() {
      this.getArtist({ id: this.track.artists[0].id })
      this.getAlbum({ id: this.track.album.id })
    }
  },
  async created() {
    this.getTrack({ id: this.id });
    this.getAudioFeatures({ id: this.id });
    this.getAudioAnalysis({ id: this.id });
  },
  methods: {
    ...mapActions('cache', [
      'getTrack',
      'getAudioFeatures',
      'getAudioAnalysis',
      'getArtist',
      'getAlbum',
    ]),
  },
}
</script>

<style module>
.album {
  margin-bottom: 1rem;
}

.artist {
  margin-bottom: 1rem;
}
</style>
