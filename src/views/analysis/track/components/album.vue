<template>
  <v-card color="grey-2">

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
  }
};
</script>