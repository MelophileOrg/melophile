<template>
  <div :class="$style.component">
    <div :class="$style.header">
      <subtitle :text="title" />

      <v-btn dense outlined text>
        See More
      </v-btn>
    </div>

    <v-divider :class="$style.divider" />

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
