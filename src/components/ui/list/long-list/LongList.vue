<template>
  <div :class="$style.component">
    <long-list-item
      v-for="(item, i) in items"
      :key="`list-${id}-${item.id}`"
      :item="item"
      :type="type"
      :id="id"
      :index="indexed ? (i + 1) : 0" />
  </div>
</template>

<script>
import LongListItem from './components/LongListItem';

export default {
  name: 'LongList',
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
    indexed: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LongListItem,
  },
};
</script>

<style module>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}
</style>
