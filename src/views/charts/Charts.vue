<template>
  <div :class="$style.component">
    <chart-header />

    <div :class="$style.content">
      <top-played-tracks-preview />

      <top-played-artists-preview />

      <div :class="$style.features">
        <happiness-preview />

        <energetic-preview />
      </div>
    </div>
  </div>
</template>

<script>
import ChartHeader from './components/ui/Header';
import TopPlayedTracksPreview from './components/features/TopPlayedTracksPreview';
import TopPlayedArtistsPreview from './components/features/TopPlayedArtistsPreview';
import HappinessPreview from './components/features/HappiestPreview';
import EnergeticPreview from './components/features/EnergeticPreview.vue';

export default {
  name: 'Charts',
  components: {
    ChartHeader,
    TopPlayedTracksPreview,
    TopPlayedArtistsPreview,
    HappinessPreview,
    EnergeticPreview,
  },
  data: () => ({
  }),
  methods: {

  },
};
</script>

<style module>
.component {
  display: block;
}

.content {
  width: calc(100% - 8rem);
  max-width: 130rem;
  margin: 0 auto;
}

.features {
  display: flex;
  justify-content:  space-between;
}

.content > div {
  margin-top: 4rem;
}
</style>
