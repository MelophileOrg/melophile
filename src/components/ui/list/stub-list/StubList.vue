<template>
  <div :class="$style.component">
    <stub-list-item
      v-for="(item, i) in items"
      :key="`list-${id}-${item.id}`"
      :item="item"
      :type="type"
      :id="id"
      :index="indexed ? (i + 1) : 0" />
  </div>
</template>

<script>
import StubListItem from './components/StubListItem';

export default {
  name: 'StubList',
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
    StubListItem,
  },
};
</script>

<style module>
.component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: white;
}
</style>
