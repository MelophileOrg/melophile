<template>
  <analysis-header
    :name="name"
    :image="image">
    <template v-slot:secondary>
      <div :class="$style['secondary-container']">
        <div
          v-for="(artist, index) in track.artists"
          :class="$style.secondary"
          :key="artist.id"
          @click="routeArtist(artist.id)">
          {{ artist.name }}{{ index === track.artists.length - 1 ? '' : ','}}
        </div>
      </div>
    </template>

    <template v-slot:tabs>
      <v-tabs
        background-color="grey-1"
        grow>
        <v-tab
          v-for="(tab, index) in tabs"
          :key="`tab-${index}`">
          {{ tab }}
        </v-tab>
      </v-tabs>
    </template>
  </analysis-header>
</template>

<script>
import AnalysisHeader from '@/views/analysis/shared/components/header.vue';

export default {
  name: 'TrackHeader',
  components: {
    AnalysisHeader
  },
  props: {
    track: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    tabs: [
      'Overview',
      'Analysis',
      'Relationship',
    ],
  }),
  computed: {
    name() {
      if (this.track) {
        return this.track.name;
      }
      return '';
    },
    image() {
      if (this.track) {
        console.log(this.track);
        return this.track.album.images[0].url;
      }
      return null;
    },
  },
  methods: {
    routeArtist(id) {
      this.$router.push(`/artist/${id}`);
    },
  },
};
</script>

<style module>
.secondary-container {
  display: flex;
  flex-wrap: nowrap;
  margin-top: .5rem;
}

.secondary {
  color: var(--grey-8);
  font-weight: 300;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: .5rem;
}

.secondary:hover {
  text-decoration: underline;
}
</style>