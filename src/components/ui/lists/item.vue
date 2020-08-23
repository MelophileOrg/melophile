<template>
  <div
    class="elevation-2"
    :class="$style.component">
    <div
      class="elevation-1"
      :class="$style.image"
      :style="{
        backgroundImage: `url('${image}')`,
      }"
      @click="playItem">
      <div :class="$style.overlay" />

      <img src="@/assets/icons/play.svg" />
    </div>

    <div :class="$style.details">
      <span :class="$style.name">
        {{ name }}
      </span>

      <span :class="[
        $style.secondary,
        {
          [$style.upper]: type === 'artist',
        }]">
        {{ secondary }}
      </span>
    </div>
  </div>
</template>

<script>
import api from '@/api';

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
    /**
     * Item name
    *
     * @type {string}
     */
    name() {
      return this.item.name || '';
    },

    /**
     * Item image url
     *
     * @type {string}
     */
    image() {
      if (this.type === 'track') {
        return this.item.album.images[0].url || '';
      } else if ([
        'album',
        'artist',
        'playlist',
      ].includes(this.type)) {
        return this.item.images[0].url || '';
      }
      return '';
    },

    /**
     * Secondary data to display
     *
     * @type {string}
     */
    secondary() {
      if ([
        'track',
        'album',
      ].includes(this.type)) {
        return this.item.artists.map(artist => artist.name).join(', ');
      } else if (this.type === 'artist') {
        return this.item.genres[0];
      } else if (this.type === 'playlist') {
        return this.item.owner.display_name;
      }
      return '';
    }
  },
  methods: {
    playItem() {
      if (this.type === 'track') {
        api.spotify.player.playTrack({ uri: this.item.uri });
      } else if ([
        'album',
        'artist',
        'playlist',
      ].includes(this.type)) {
        api.spotify.player.playContext({ uri: this.item.uri });
      }
    }
  }
};
</script>

<style module>
.component {
  align-items: center;
  background: var(--grey-2);
  border-radius: 1rem;
  display: flex;
  margin: .5rem;
  padding: 1rem;
  width: 100%;
}

.component .image {
  align-items: center;
  background-position: center center;
  background-size: 100% auto;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  height: 6rem;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 6rem;
}

.component .image img {
  opacity: 0;
  height: 4rem;
  transition: all .2s ease;
}

.component .image .overlay {
  background-color: rgb(255, 255, 255);
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: all .2s ease;
}

.component .image:hover img {
  opacity: 1;
}

.component .image:hover .overlay {
  opacity: .2;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1.5rem;
}

.details span {
  cursor: pointer;
}

.details span:hover {
  text-decoration: underline;
}

.details span.name {
  font-size: 1.5rem;
}

.details span.secondary {
  color: var(--grey-5);
  font-size: 1.3rem;
}

.details span.secondary.upper {
  text-transform: capitalize;
}
</style>