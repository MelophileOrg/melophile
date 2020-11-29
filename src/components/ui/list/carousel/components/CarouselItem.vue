<template functional>
  <div :class="$style.component">
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
          :class="[$style.secondary, {
              [$style.hover]: props.type !== 'artist',
            }]"
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
  name: 'CarouselItem',
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
  },
  parseImage: helpers.parseImage,
  parseSecondary: helpers.parseSecondary,
};
</script>

<style module>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  border-radius: .5rem;
}

.image {
  width: 18rem;
  border-radius: .5rem;
  margin: 0 0 1rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 40rem;
}

p.name {
  width: 100%;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  text-overflow: clip;
  text-align: center;
}

p.name:hover {
  text-decoration: underline;
}

div.secondaries {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

span.secondary {
  font-size: 1.4rem;
}

span.secondary.hover {
  cursor: pointer;
}

span.secondary.hover:hover {
  text-decoration: underline;
}
</style>
