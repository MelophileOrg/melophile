<template>
  <div :class="$style.component">
    <carousel-item
      v-for="item in items"
      :key="`list-${id}-${item.id}`"
      :item="item"
      :type="type"
      :id="id" />
  </div>
</template>

<script>
import CarouselItem from './components/CarouselItem';

export default {
  name: 'Carousel',
  props: {
    id: {
      type: String,
      default: Math.random().toString(36).substring(7),
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
    CarouselItem,
  },
};
</script>

<style module>
.component {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  justify-content: space-between;
}
</style>
