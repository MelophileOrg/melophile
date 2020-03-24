<template>
    <div class="ListArtist" @click="play">
        {{artist.name}}
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListArtist',
  props: {
    artist: Object,
  },
  methods: {
    async play() {
      try {
        await axios.put('/api/play/artist/' + this.artist._id);
      } catch (error) {
        return;
      }
    }
  }
}
</script>

<style scoped>
.ListArtist {
    
}
</style>