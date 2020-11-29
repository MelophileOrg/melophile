<template>
  <div :class="$style.component">
    <subtitle :text="title" />

    <long-list
      :items="items"
      :type="type"
      :indexed="indexed" />
  </div>
</template>

<script>
import LongList from '@/components/ui/list/long-list/LongList';
import Subtitle from './Subtitle';

export default {
  name: 'PreviewList',
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
    indexed: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LongList,
    Subtitle,
  },
};
</script>

<style module>
.component {
  margin: 1rem 0;
}
</style>
