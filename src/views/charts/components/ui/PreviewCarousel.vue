<template>
  <div :class="$style.component">
    <div :class="$style.header">
      <subtitle :text="title" />

      <v-btn dense outlined text>
        See More
      </v-btn>
    </div>

    <v-divider :class="$style.divider" />

    <carousel
      :items="items"
      :type="type" />
  </div>
</template>

<script>
import Carousel from '@/components/ui/list/carousel/Carousel';
import Subtitle from './Subtitle';

export default {
  name: 'PreviewCarousel',
  props: {
    title: {
      type: String,
      default: 'Top Chart',
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: 'track',
    },
  },
  components: {
    Carousel,
    Subtitle,
  },
};
</script>

<style module>
.component {
  margin: 1rem 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1:first-child {
  margin-right: 1rem;
}

.divider {
  margin-bottom: 1rem;
}
</style>
