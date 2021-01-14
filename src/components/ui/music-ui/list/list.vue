<template>
  <div :class="[$style.component, 
    {
      [$style.xs]: size ==='xs',
      [$style.sm]: size ==='sm',
      [$style.md]: size ==='md',
      [$style.lg]: size ==='lg',
      [$style.stats]: size ==='stats',
    }]">
    <template v-for="(item, index) in items">
      <span
        v-if="indexed"
        :key="`list-${id}-${item.id}-index`"
        :class="$style.index">
        {{ paddedIndex(index) }}
      </span>

      <v-btn
        :key="`list-${id}-${item.id}-add`"
        icon
        x-small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <span
        :key="`list-${id}-${item.id}-image`"
        :class="$style.image"
        :style="{
          'background-image': `url('${image}')`,
        }" />

      <span :key="`list-${id}-${item.id}-name`">
        {{ item.name }}
      </span>

      <div :key="`list-${id}-${item.id}-secondaries`">
        <span
          v-for="secondary in secondaries"
          :key="`list-${listId}-${item.id}-secondary-${secondary.id}`">
          {{ secondary.text }}
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import ListItem from './list-item';

export default {
  name: 'List',
  props: {
    /**
     * List ID for key labeling
     *
     * @type {string}
     */
    id: {
      type: String,
      default: Math.random().toString(36).substring(7),
    },

    /**
     * Items in list
     *
     * @type {Array<object>} artists, playlists, albums, tracks, genres, users
     */
    items: {
      type: Array,
      default: () => ([]),
    },

    /**
     * Whether each item should be indexed
     *
     * @type {boolean} true, false
     */
    indexed: {
      type: Boolean,
      default: false,
    },

    /**
     * Size of components
     *
     * @type {string} 'xs', 'sm', 'md', 'lg'
     */
    size: {
      type: String,
      default: 'lg',
    },

    /**
     * Width in respect to window
     *
     * @type {string} 'full', 'partial'
     */
    width: {
      type: String,
      default: 'full',
    },

    /**
     * Whether to add transparent background
     *
     * @type {boolean} true, false
     */
    background: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ListItem
  },
  computed: {
    converted() {
      return this.items.map((item) => {
        const convertedItem = {};

        if ([
          'track',
          'artist',
          'album',
          'playlist',
          'genre',
        ].includes(item.type)) {
          convertedItem.name = item.name;
        } else if (item.type === 'user') {
          convertedItem.name = item.display_name;
        }

      })
    },
    maxIndexDigits() {
      return this.items.length.toString().length; 
    },
  },
  methods: {
    paddedIndex(index) {
      let currDigits = (index + 1).toString().length;
      return currDigits >= this.maxIndexDigits ? (index + 1) : new Array(this.maxIndexDigits - currDigits + 1).join('0') + (index + 1);
    },
  }
}
</script>

<style module>
.component {
  display: grid;
  align-items: center;
  gap: 0 1rem;
  margin: 2rem 0;
}

.component.xs {
  /* Index, Name, Artists, Time, Menu */
  grid-template-columns: 3rem auto auto 3rem 3rem;
}

.component.sm {
  /* Index, Add, Name, Artists, Popularity, Time, Menu */
  grid-template-columns: 3rem 3rem auto auto 3rem 3rem 3rem;
}

.component.md {
  /* Index, Add, Image, Name, Artists, Popularity, Time, Menu */
  grid-template-columns: 3rem 3rem 4rem auto auto 3rem 3rem 3rem;
}

.component.lg {
  /* Index, Add, Image, Name, Artists, Album, Plays, Menu */
  grid-template-columns: 3rem 3rem 4rem auto auto auto 3rem 3rem;
}

.component.stats {
  /* Index, Add, Image, Name / Artists, Valence, Energy, Danceability, Menu */
  grid-template-columns: 3rem 3rem 4rem auto 3rem 3rem 3rem 3rem;
}
</style>
