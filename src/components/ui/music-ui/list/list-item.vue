<template>
  
</template>

<script>
import parseImage from '../helpers/parse-image';
import padZeros from '../helpers/parse-image';

export default {
  name: 'ListItem',
  props: {
    /**
     * List ID for key labeling
     * 
     * @type {string}
     */
    listId: {
      type: String,
    },

    /**
     * Item to display
     *
     * @type {object} artist, playlist, album, track, genre, user
     */
    item: {
      type: Object,
    },

    /**
     * Whether each item should be indexed
     *
     * @type {boolean} true, false
     */
    indexed: {
      type: Boolean,
    },

    /**
     * The index of the item in the list
     *
     * @type {number}
     */
    index: {
      type: Number,
    },

    /**
     * Size of components
     *
     * @type {string} 'xs', 'sm', 'md', 'lg'
     */
    size: {
      type: String,
    },

    /**
     * Width in respect to window
     *
     * @type {string} 'full', 'partial'
     */
    width: {
      type: String,
    },

    /**
     * Whether to add transparent background
     *
     * @type {boolean} true, false
     */
    background: {
      type: Boolean,
    },

    /**
     * Number of digits in last index
     */
    maxIndexDigits: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    parseImage,
    padZeros,
  },
  computed: {
    image() {
      if (this.item) {
        if (this.item.type === 'track') {
          return this.item.album.images[0].url;
        } if ([
          'artist',
          'album',
          'playlist',
          'user',
        ].includes(this.item.type)) {
          return this.item.images[0].url;
        }
      }
      return null;
    },
    secondaries() {
      if (this.item) {
        if ([
          'track',
          'album',
        ].includes(this.item.type)) {
          return this.item.artists.map((artist) => ({
            text: artist.name,
            id: artist.id,
          }));
        } if (this.item.type === 'artist') {
          const formatedFollowers = this.item.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return [{
            text: `${formatedFollowers} Followers`,
            id: this.item.id,
          }];
        } if (this.item.type === 'playlist') {
          return [{
            text: this.item.owner.display_name,
            id: this.item.owner.id,
          }];
        }
      }
      return [];
    },
  },
}
</script>

<style module>
.component .index {
  font-size: 1.2rem;
  text-align: center;
}

.component .image {
  --size: 4rem;

  display: block;
  height: var(--size);
  width: var(--size);
  background-size: 100% 100%;
}
</style>
