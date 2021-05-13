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

      <h1 @click="routeAlbum">
        {{ name }}
      </h1>

      <p>
        Followers
      </p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'TrackAlbum',
  props: {
    album: {
      type: Object,
      default: () => (null),
    },
  },
  computed: {
    name() {
      if (this.album) {
        return this.album.name;
      }
      return '';
    },
    image() {
      if (this.album) {
        return this.album.images[0].url;
      }
      return '';
    },
  },
  methods: {
    routeAlbum() {
      this.$router.push(`/album/${this.album.id}`);
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
  text-align: center;
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