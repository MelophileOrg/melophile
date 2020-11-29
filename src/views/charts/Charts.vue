<template>
  <div :class="$style.component">
    <chart-header />

    <top-played-tracks-preview />

    <top-played-artists-preview />
  </div>
</template>

<script>
import ChartHeader from './components/ui/Header';
import TopPlayedTracksPreview from './components/features/TopPlayedTracksPreview';
import TopPlayedArtistsPreview from './components/features/TopPlayedArtistsPreview';

export default {
  name: 'Charts',
  components: {
    ChartHeader,
    TopPlayedTracksPreview,
    TopPlayedArtistsPreview,
  },
  data: () => ({
  }),
  async created() {
    /*
      Get
        Top 5 Played
          Track
          Artists
        Top 5 Genres
        Top Happiest
        Top Saddest
    */
  },
  methods: {

  },
};
</script>

<style module>
.component {
  display: block;
  margin: 0 auto;
  width: calc(100% - 8rem);
  max-width: 130rem;
}
</style>
