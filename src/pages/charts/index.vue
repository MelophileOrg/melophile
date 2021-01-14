<template>
  <v-container :class="$style.component">
    <h1>
      My Top Charts
    </h1>

    <top-played-tracks-preview />
  </v-container>
</template>

<script>
import TopPlayedTracksPreview from './components/previews/top-played-tracks-preview';

export default {
  name: 'Charts',
  components: {
    TopPlayedTracksPreview,
  },
}
</script>

<style module>
.component {
  margin: 0 auto;
  max-width: var(--max-width);
  width: calc(100% - 2rem);
}
</style>
