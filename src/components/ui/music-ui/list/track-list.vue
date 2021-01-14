<template>
  <div
    :class="$style.component"
    :style="{
      'grid-template-columns': grid,
    }">
    <template v-for="(item, index) in items">
      <span
        :key="`list-${id}-${item.id}-border`"
        :class="$style.divider" />

      <span
        v-if="showIndex"
        :key="`list-${id}-${item.id}-index`"
        :class="$style.index"
        class="subtitle">
        {{ paddedIndex(index) }}
      </span>

      <v-btn
        v-if="showAddButton"
        :key="`list-${id}-${item.id}-add`"
        icon
        x-small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <span
        v-if="showImage"
        :key="`list-${id}-${item.id}-image`"
        :class="$style.image"
        :style="{
          'background-image': `url('${item.album.images[0].url}')`,
        }" />

      <span
        :key="`list-${id}-${item.id}-name`"
        :class="$style.name"
        class="item-title">
        {{ item.name }}
      </span>

      <div
        v-if="showArtists === 'separate'"
        :key="`list-${id}-${item.id}-secondaries`">
        <template v-for="(secondary, index) in item.artists">
          <span
            :key="`list-${listId}-${item.id}-artist-${secondary.id}`"
            :class="$style.artist">
            {{ secondary.name }}
          </span>

          <span
            v-if="index + 1 < item.artists.length"
            :key="`list-${listId}-${item.id}-artist-separator-${index}`">
            &#8226;
          </span>
        </template>
        
      </div>

      <span
        v-if="showAlbum"
        :key="`list-${id}-${item.id}-album`">
        {{ item.album.name }}
      </span>

      <list-feature-value 
        v-if="showPopularity"
        :key="`list-${id}-${item.id}-popularity`"
        :value="item.popularity" />

      <list-feature-value 
        v-if="showKey"
        :key="`list-${id}-${item.id}-key`"
        :value="item.key" />

      <list-feature-value 
        v-if="showMode"
        :key="`list-${id}-${item.id}-mode`"
        :value="item.mode" />

      <list-feature-value 
        v-if="showTempo"
        :key="`list-${id}-${item.id}-tempo`"
        :value="item.tempo" />

      <list-feature-value 
        v-if="showValence"
        :key="`list-${id}-${item.id}-valence`"
        :value="item.valence" />

      <list-feature-value 
        v-if="showDanceability"
        :key="`list-${id}-${item.id}-danceability`"
        :value="item.danceability" />

      <list-feature-value 
        v-if="showEnergy"
        :key="`list-${id}-${item.id}-energy`"
        :value="item.energy" />

      <list-feature-value 
        v-if="showAcousticness"
        :key="`list-${id}-${item.id}-acousticness`"
        :value="item.acousticness" />

      <list-feature-value 
        v-if="showInstrumentalness"
        :key="`list-${id}-${item.id}-instrumentalness`"
        :value="item.instrumentalness" />

      <list-feature-value 
        v-if="showLiveness"
        :key="`list-${id}-${item.id}-liveness`"
        :value="item.liveness" />

      <list-feature-value 
        v-if="showLoudness"
        :key="`list-${id}-${item.id}-loudness`"
        :value="item.loudness" />

      <list-feature-value 
        v-if="showSpeechiness"
        :key="`list-${id}-${item.id}-speechiness`"
        :value="item.speechiness" />

      <list-feature-value 
        v-if="showDuration"
        :key="`list-${id}-${item.id}-duration`"
        :value="item.ms_duration" />

      <list-feature-value 
        v-if="showInstrumentalness"
        :key="`list-${id}-${item.id}-instrumentalness`"
        :value="item.instrumentalness" />

      <v-btn
        v-if="showMenu"
        :key="`list-${id}-${item.id}-menu`"
        icon>
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
import ListFeatureLevel from './components/list-feature-value';

export default {
  name: 'TrackList',
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
     * Items in track list
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
    showIndex: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to display album art
     * 
     * @type {boolean} true, false
     */
    showImage: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to display add button
     * 
     * @type {boolean} true, false
     */
    showAddButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to display menu button
     * 
     * @type {boolean} true, false
     */
    showMenu: {
      type: Boolean,
      default: true,
    },

    /**
     * Where to show artist's names
     *
     * @type {string} 'off', 'grouped', 'separate'
     */
    showArtists: {
      type: String,
      default: 'off'
    },

    /**
     * Whether to show album name
     * 
     * @type {boolean} true, false
     */
    showAlbum: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show popularity level
     * 
     * @type {boolean} true, false
     */
    showPopularity: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show assumed key
     * 
     * @type {boolean} true, false
     */
    showKey: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show major or minor
     * 
     * @type {boolean} true, false
     */
    showMode: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show tempo
     * 
     * @type {boolean} true, false
     */
    showTempo: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show valence value
     * 
     * @type {boolean} true, false
     */
    showValence: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show danceability value
     * 
     * @type {boolean} true, false
     */
    showDanceability: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show energy value
     * 
     * @type {boolean} true, false
     */
    showEnergy: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show acousticness value
     * 
     * @type {boolean} true, false
     */
    showAcousticness: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show instrucmentalness value
     * 
     * @type {boolean} true, false
     */
    showInstrumentalness: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show liveness value
     * 
     * @type {boolean} true, false
     */
    showLiveness: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show loudness value
     * 
     * @type {boolean} true, false
     */
    showLoudness: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show speechiness value
     * 
     * @type {boolean} true, false
     */
    showSpeechiness: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show duration in seconds
     * 
     * @type {boolean} true, false
     */
    showDuration: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to add transparent background
     *
     * @type {boolean} true, false
     */
    showBackground: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ListFeatureLevel,
  },
  computed: {
    /**
     * Max digit length of items to be padded by 0s
     * 
     * @returns {Number} Max digits
     */
    maxIndexDigits() {
      return Math.max(this.items.length.toString().length, 2); 
    },

    /**
     * Grid template columns property based on displayed items.
     * Crud implementation, needs work
     * 
     * @returns {string} grid-template-columns
     */
    grid() {
      let index = this.showIndex ? '3rem' : '';
      let add = this.showAddButton ? ' 3rem' : '';
      let image = this.showImage ? ' 4rem' : '';
      let artists = this.showArtists === 'separate' ? ' auto' : '';
      let album = this.showAlbum ? ' auto' : '';
      let popularity = this.showPopularity ? ' 3rem' : '';
      let key = this.showKey ? ' 3rem' : '';
      let mode = this.showMode ? ' 3rem' : '';
      let tempo = this.showTempo ? ' 3rem' : '';
      let valence = this.showValence ? ' 3rem' : '';
      let danceability = this.showDanceability ? ' 3rem' : '';
      let energy = this.showEnergy ? ' 3rem' : '';
      let acousticness = this.showAcousticness ? ' 3rem' : '';
      let instrumentalness = this.showInstrumentalness ? ' 3rem' : '';
      let liveness = this.showLiveness ? ' 3rem' : '';
      let loudness = this.showLoudness ? ' 3rem' : '';
      let speechiness = this.showSpeechiness ? ' 3rem' : '';
      let duration = this.showDuration ? ' 3rem' : '';
      let menu = this.showMenu ? ' 3rem' : '';
      
      return `${index}${add}${image} auto${artists}${album}${popularity}${key}${mode}${tempo}${valence}${danceability}${energy}${acousticness}${instrumentalness}${liveness}${loudness}${speechiness}${duration}${menu}`;
    },
  },
  methods: {
    /**
     * Pads index with 0s based on max index digits
     * 
     * @returns {string | number}
     */
    paddedIndex(index) {
      let currDigits = (index + 1).toString().length;
      return currDigits >= this.maxIndexDigits ? (index + 1) : new Array(this.maxIndexDigits - currDigits + 1).join('0') + (index + 1);
    },
  },
}
</script>

<style module>
.component {
  display: grid;
  align-items: center;
  gap: 0 1rem;
  margin: 2rem 0;
}

.divider {
  display: block;
  opacity: .08;
  width: 100%;
  height: .1rem;
  background-color: var(--light-grey-7);
  grid-column: 1 / -1;
}

.index {
  color: var(--txt-3);
  font-size: 1.4rem;
  text-align: center;
}

.image {
  --size: 4rem;

  display: block;
  height: var(--size);
  width: var(--size);
  background-size: 100% 100%;
  border-radius: .2rem;
}

.name {
  cursor: pointer;
  line-height: 5.6rem !important;
}

.name:hover {
  text-decoration: underline;
}

.artist {
  color: var(--txt-3);
  font-size: 1.4rem;
  cursor: pointer;
}

.artist:hover {
  text-decoration: underline;
}
</style>
