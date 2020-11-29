<template>
  <div :class="$style.component">
    <subtitle :text="title" />

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
</style>
