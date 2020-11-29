<template>
  <div :class="$style.component">
    <subtitle :text="title" />

    <stub-list
      :items="items"
      :type="type"
      :indexed="indexed" />
  </div>
</template>

<script>
import StubList from '@/components/ui/list/stub-list/StubList';
import Subtitle from './Subtitle';

export default {
  name: 'PreviewStubs',
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
    StubList,
    Subtitle,
  },
};
</script>

<style module>
.component {
  margin: 1rem 0;
}
</style>
