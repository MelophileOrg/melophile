<template functional>
  <div :class="$style.component">
    <p
      v-if="props.index !== 0"
      :class="$style.index">
      {{
        (10 >= props.index) ? `0${props.index}` : props.index
      }}
    </p>

    <img
      :class="$style.image"
      :src="$options.parseImage(props.item, props.type)" />

    <div :class="$style.content">
      <p :class="$style.name">
        {{
          props.item.name
        }}
      </p>

      <div :class="$style.secondaries">
        <span
          :class="$style.secondary"
          v-for="secondary in $options.parseSecondary(props.item, props.type)"
          :key="`list-${id}-${props.item.id}-secondary-${secondary.id || secondary.text}`">
          {{
            secondary.text
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../../helpers/index';

export default {
  functional: true,
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
  parseImage: helpers.parseImage,
  parseSecondary: helpers.parseSecondary,
};
</script>

<style module>
.component {
  display: flex;
  align-items: center;
  background: white;
  margin: 1rem 0;
  width: calc(33% - 1.5rem);
}

p.index {
  font-size: 1.8rem;
  margin: 0 0 0 1rem;
}

.image {
  width: 5.5rem;
  border-radius: .5rem;
  margin: 1rem;
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
