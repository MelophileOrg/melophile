<template>
  <analysis-header
    :name="name"
    :image="image">
    <template v-slot:secondary>
      <div
        v-if="track"
        :class="$style['secondary-container']">
        <div
          v-for="(artist, index) in track.artists"
          :class="$style.secondary"
          :key="artist.id"
          @click="routeArtist(artist.id)">
          {{ artist.name }}{{ index === track.artists.length - 1 ? '' : ','}}
        </div>
      </div>

      <div
        v-else
        class="loader"
        :class="$style['secondary-loader']" />
    </template>

    <template v-slot:tabs>
      <v-tabs
        background-color="grey-2"
        color="white"
        grow
        :value="value"
        @change="$emit('input', $event)">
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
    value: {
      type: Number,
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
      return this.track !== null ? this.track.name : '';
    },
    image() {
      return this.track !== null ? this.track.album.images[0].url : '';
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

.secondary-loader {
  display: block;
  width: 10rem;
  height: 1.5rem;
  border-radius: .5rem;
}
</style>