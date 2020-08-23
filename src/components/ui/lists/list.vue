<template>
  <div :class="$style.component">
    <item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :type="type" />
  </div>
</template>

<script>
import Item from './item';

export default {
  name: 'List',
  components: {
    Item,
  },
  props: {
    /**
     * Array of items
     * 
     * @type {Array<object>}
     */
    items: {
      type: Array,
      default: () => ([]),
    },

    /**
     * Type of item
     * 
     * @type {string}
     */
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
  align-items: center;
}
</style>