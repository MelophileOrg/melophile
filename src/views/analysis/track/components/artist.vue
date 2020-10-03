<template>
  <v-card color="grey-2">
    <div :class="$style.content">
      <p :class="$style.type">
        ARTIST
      </p>

      <div
        class="elevation-4"
        :class="[$style.image, {
          loader: !image,
        }]"
        :style="{
          backgroundImage: `url('${image}')`,
        }" />

      <h1>
        {{ name }}
      </h1>

      <p>
        {{ followers }}
      </p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'TrackArtist',
  props: {
    artist: {
      type: Object,
      default: () => (null),
    },
  },
  computed: {
    name() {
      if (this.artist) {
        return this.artist.name;
      }
      return '';
    },
    image() {
      if (this.artist) {
        console.log(this.artist);
        return this.artist.images[0].url;
      }
      return '';
    },
    followers() {
      if (this.artist) {
        return this.artist.followers.total;
      }
      return '';
    },
  },
};
</script>

<style module>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 20rem;
  padding: 2rem 0rem;
}

p.type {
  text-transform: uppercase;
  color: var(--grey-7);
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
}

.content h1 {
  color: white;
}

.image {
  width: 20rem;
  height: 20rem;
  background-size: 100% 100%;
}
</style>