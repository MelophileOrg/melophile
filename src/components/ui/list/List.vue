<template>
  <div :class="$style.component">
    <list-item
      v-for="item in items"
      :key="`list-${id}-${item.id}`"
      :item="item"
      :type="type" />
  </div>
</template>

<script>
import ListItem from './list-item/ListItem';

export default {
  name: 'List',
  components: {
    ListItem,
  },
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
};
</script>

<style module>
.component {
  display: flex;
  flex-direction: column;
}
</style>
