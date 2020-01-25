<template>
  <div class="ListArtist">
    <div v-if="artist != null">
        <h1 @click="routeArtist()">{{artist.name}}</h1>
        <div class="flex sub-flex" v-if="artist.genres.length > 0">
            <h2 @click="routeGenre(index)" v-for="(genre, index) in artist.genres" :key="artist._id + '-' + genre">{{genre + comma(index, artist.genres.length)}}</h2>
        </div>
        <h2 class="empty" v-else>No Genres</h2>
    </div>
  </div>
</template>

<script>

export default {
    name: 'ListArtist',
    props: {
        artist: Object,
    },
    methods: {
      routeArtist() {
        this.$router.push('/artist/' + this.artist._id);
      },
      routeGenre(index) {
        this.$router.push('/genre/' + this.artist.genres[index]);
      },
      comma(index, total) {
        if (index < total - 1)
            return ',';
        return '';
      }
    },
};
</script>


<style scoped>

h1 {
  margin: 0 0;
  display: block;
  text-align: left;
  max-width: calc(100%);
  font-size: 1.1em; 
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-weight: lighter;
    text-transform: capitalize;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
}

h2:hover {
    text-decoration: underline;
}

.sub-flex {
  max-width: 100%;
  overflow: hidden;
}

h2.empty {
  color: hsla(0,0%,100%,.114)!important;
}

h2.empty:hover {
   text-decoration: none;
   cursor: default;
}
</style>