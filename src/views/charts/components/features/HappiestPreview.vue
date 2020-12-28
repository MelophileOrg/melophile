<template>
  <preview-list
    title="Happiest Tracks"
    type="track"
    :class="$style.component"
    :items="items"
    :indexed="true" />
</template>

<script>
import api from '@/api';
import PreviewList from '../ui/PreviewList';

export default {
  name: 'HappiestPreview',
  components: {
    PreviewList,
  },
  data: () => ({
    items: [],
  }),
  async created() {
    const response = await api.spotify.charts.extremes('valence', 'max', 0, 6);

    this.items = response.data;
  },
};
</script>

<style module>
.component {
  width: calc(50% - 2rem);
}
</style>
