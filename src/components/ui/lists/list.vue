<template>
  <div :class="$style.component">
    <list-header 
      v-if="title"
      :title="title"
      :action="action"
      @action="handle" />

    <item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :type="type" />
  </div>
</template>

<script>
import ListHeader from './components/list-header';
import Item from './components/list-item';

export default {
  name: 'List',
  components: {
    ListHeader,
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

    /**
     * Header text
     * 
     * @type {string}
     */
    title: {
      type: String,
      default: null,
    },

    /**
     * Header action text
     * 
     * @type {string}
     */
    action: {
      type: String,
      default: null,
    },
  },
  methods: {
    handle() {
      this.$emit('action');
    },
  },
};
</script>

<style module>
.component {
  padding: 1rem;
}
</style>