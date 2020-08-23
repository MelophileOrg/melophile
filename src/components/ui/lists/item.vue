<template>
  <div
    class="elevation-2"
    :class="$style.component">
    <img :src="image" />

    <div :class="$style.details">
      <span :class="$style.name">
        {{ name }}
      </span>

      <span :class="$style.secondary">
        {{ secondary }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    /**
     * Item data
     * 
     * @type {object}
     */
    item: {
      type: Object,
      default: () => ({}),
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
  computed: {
    name() {
      return this.item.name || '';
    },
    image() {
      if (this.type === 'track') {
        return this.item.album.images[0].url || '';
      } else {
        return this.item.images[0].url || '';
      }
    },
    secondary() {
      if (this.type === 'track') {
        return this.item.artists.map(artist => artist.name).join(', ');
      }
      return '';
    }
  }
};
</script>

<style module>
.component {
  display: flex;
  background: var(--grey-2);
  border-radius: 1rem;
  align-items: center;
  width: 100%;
  padding: 1rem;
  margin: .5rem;
}

img {
  border-radius: 1rem;
  height: 6rem;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1.5rem;
}

.details span.name {
  font-size: 1.5rem;
}

.details span.secondary {
  color: var(--grey-5);
  font-size: 1.3rem;
}
</style>