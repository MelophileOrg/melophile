<template>
  <div :class="$style.component">
    <img
      :class="$style.image"
      :src="parseImage(item, type)" />

    <div :class="$style.content">
      <p :class="$style.name">
        {{ item.name }}
      </p>

      <div :class="$style.secondaries">
        <span
          :class="[$style.secondary, {
              [$style.hover]: type !== 'artist',
            }]"
          v-for="secondary in parseSecondary(item, type)"
          :key="`list-${id}-${item.id}-secondary-${secondary.id || secondary.text}`">
          {{ secondary.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../../helpers/index';

export default {
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
  methods: {
    parseImage: helpers.parseImage,
    parseSecondary: helpers.parseSecondary,
  },
};
</script>

<style module>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 2rem 1rem 0;
}

.image {
  width: 18rem;
  margin: 0 0 1rem 0;
  border: 1px solid rgba(0, 0, 0, 0.068);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 40rem;
}

p.name {
  width: 100%;
  max-width: 18rem;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
