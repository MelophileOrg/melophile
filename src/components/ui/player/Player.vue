<template>
  <v-bottom-navigation
    :input-value="isPlaying"
    app
    absolute
    height="10rem">
    <div
      v-if="isPlaying"
      :class="$style.component">
      <img :src="image" />

      <div :class="$style.content">
        <span
          :class="[$style.name, $style.link]"
          @click="routePrimary">
          {{ name }}
        </span>

        <div :class="$style.secondaries">
          <span
            v-for="(secondary, index) in secondaries"
            :key="secondary.id"
            :class="[$style.secondary,
              {
                [$style.link]: type !== 'artist',
              }
            ]"
            @click="routeSecondary(index)">
            {{ secondary.name }}{{ index !== secondaries.length - 1 ? ',' : ''}}
          </span>
        </div>
      </div>

      <v-spacer />

      <div :class="$style.controls">
        <div :class="$style.playback">
          <v-btn
            icon
            @click="previous">
            <v-icon>mdi-skip-previous</v-icon>
          </v-btn>

          <v-btn
            icon
            @click="pausePlay">
            <v-icon>{{ isPlaying ? 'mdi-pause-circle-outline' : 'mdi-play-circle-outline' }}</v-icon>
          </v-btn>

          <v-btn
            icon
            @click="next">
            <v-icon>mdi-skip-next</v-icon>
          </v-btn>
        </div>

        <v-slider
          hint="Im a hint"
          :max="track.duration_ms"
          min="0"
          :value="progress"
          dense />
      </div>

      <v-spacer />

      <v-slider
        hint="Im a hint"
        max="100"
        min="0"
        :value="volumePercent"
        dense />
    </div>
  </v-bottom-navigation>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '@/api';

export default {
  name: 'Player',
  computed: {
    ...mapGetters('player', [
      'isPlaying',
      'track',
      'volumePercent',
    ]),
    image() {
      if (this.track !== null) {
        console.log(this.track);
        return this.track.album.images[0].url;
      }
      return '';
    },
    name() {
      if (this.track !== null) {
        return this.track.name;
      }
      return null;
    },
    secondaries() {
      if (this.track !== null) {
        return this.track.artists.map((artist) => ({ name: artist.name, id: artist.id }));
      }
      return null;
    },
  },
  methods: {
    routePrimary() {
      this.$router.push(`/track/${this.track.id}`);
    },
    routeSecondary(index) {
      this.$router.push(`/artist/${this.track.artists[index].id}`);
    },
    pausePlay() {
      if (this.isPlaying) {
        api.spotify.player.pause();
      } else {
        api.spotify.player.play();
      }
    },
    next() {
      api.spotify.player.next();
    },
    previous() {
      api.spotify.player.previous();
    },
  },
};
</script>

<style module>
.component {
  display: flex;
  align-items: center;
  width: calc(100% - 1rem);
}

.component img {
  --size: 8rem;
  width: var(--size);
  height: var(--size);
  margin-right: 1.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content span {
  display: inline-block;
  font-size: 1.5rem;
  padding: 0;
}

.content span.link:hover {
  cursor: pointer;
  text-decoration: underline;
}

.content span.name {
  color: var(--title);
  font-weight: 600;
}

.secondaries {
  display: flex;
}

.secondaries span {
  margin-right: .5rem;
}

.controls .playback {
  display: flex;
  justify-content: center;
}
</style>
