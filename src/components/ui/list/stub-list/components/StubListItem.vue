<template>
  <div
    :style="{
        '--indexed': + index !== 0 ? '3rem' : '0',
      }"
    :class="$style.component">
    <p
      v-if="index !== 0"
      :class="$style.index">
      {{
        (10 >= index) ? `0${index}` : index
      }}
    </p>

    <div :class="$style.image">
      <img
        :class="$style.image"
        :src="parseImage(item, type)" />

      <span :class="$style.play" />
    </div>

    <div :class="$style.content">
      <p
        :class="$style.name"
        @click="listeners['primaryclick'](item.id)">
        {{
          item.name
        }}
      </p>

      <div :class="$style.secondaries">
        <span
          v-for="secondary in parseSecondary(item, type)"
          :key="`list-${id}-${item.id}-secondary-${secondary.id || secondary.text}`"
          :class="$style.secondary"
          @click="listeners['secondaryclick'](secondary.id)">
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
  --indexed: 0;
  display: flex;
  align-items: center;
  background: white;
  margin: .75rem 0;
  width: calc(33% - 1.5rem);
}

p.index {
  font-size: 1.5rem;
  margin: 0 0 0 1.5rem;
  color: rgba(100, 100, 100, .4);
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.034);
}

.image {
  cursor: pointer;
  position: relative;
  margin: .5rem .5rem;
}

.image img {
  width: 4.5rem;
  border: 1px solid rgba(0, 0, 0, 0.068);
}

.image .play {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url('../../../../../assets/icons/play.svg');
  background-size: 50% 50%;
  background-position: center center;
  opacity: 0;
  transition: all .2s ease;
}

.image:hover .play {
  opacity: 1;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 8.5rem - var(--indexed));
}

p.name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

p.name:hover {
  text-decoration: underline;
}

div.secondaries {
  display: flex;
  overflow: hidden;
  width: 100%;
}

span.secondary {
  font-size: 1.4rem;
  cursor: pointer;
  white-space: nowrap;
  max-width: 100%;
}

span.secondary:hover {
  text-decoration: underline;
}
</style>
