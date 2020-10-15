<template>
  <v-card color="grey-2">
    <div :class="$style.content">
      <div
        class="elevation-4"
        :class="[$style.image, {
          loader: !image,
        }]"
        :style="{
          backgroundImage: `url('${image}')`,
        }" />

      <h1 @click="routeArtist">
        {{ name }}
      </h1>

      <p>
        {{ followers }} Followers
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
        return this.artist.images[0].url;
      }
      return '';
    },
    followers() {
      if (this.artist) {
        return this.artist.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return '';
    },
  },
  methods: {
    routeArtist() {
      this.$router.push(`/artist/${this.artist.id}`);
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
}

.content h1 {
  color: white;
  font-size: 1.8rem;
  margin: 1.3rem 0 .3rem;
  font-weight: 300;
}

.content h1:hover {
  cursor: pointer;
  text-decoration: underline;
}

.content p {
  font-size: 1.2rem;
}

.image {
  --size: 20rem;
  width: var(--size);
  height: var(--size);
  background-size: 100% 100%;
  border-radius: .2rem;
}
</style>