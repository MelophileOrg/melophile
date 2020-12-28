<template>
  <div :class="$style.component">
    <p
      v-if="index !== 0"
      :class="$style.index">
      {{
        (10 >= index) ? `0${index}` : index
      }}
    </p>

    <img
      :class="$style.image"
      :src="parseImage(item, type)" />

    <div :class="$style.content">
      <p :class="$style.name">
        {{
          item.name
        }}
      </p>

      <div :class="$style.secondaries">
        <span
          :class="$style.secondary"
          v-for="secondary in parseSecondary(item, type)"
          :key="`list-${id}-${item.id}-secondary-${secondary.id || secondary.text}`">
          {{
            secondary.text
          }}
        </span>
      </div>
    </div>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-dots-horizontal</v-icon>
    </v-btn>
  </div>
</template>

<script>
import helpers from '../../helpers/index';

export default {
  name: 'StubListItem',
  props: {
    id: {
      type: String,
    },
    item: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'track',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    parseImage: helpers.parseImage,
    parseSecondary: helpers.parseSecondary,
  },
};
</script>

<style module>
.component {
  display: flex;
  align-items: center;
  margin: .5rem 0;
  padding-right: .5rem;
  width: 100%;
}

p.index {
  font-size: 1.5rem;
  margin: 0 0 0 1rem;
  color: rgba(100, 100, 100, .4);
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.034);
}

.image {
  width: 4.5rem;
  margin: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.068);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 40rem;
}

p.name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  text-overflow: clip;
}

p.name:hover {
  text-decoration: underline;
}

div.secondaries {
  display: flex;
  overflow: hidden;
}

span.secondary {
  font-size: 1.4rem;
  cursor: pointer;
}

span.secondary:hover {
  text-decoration: underline;
}
</style>
