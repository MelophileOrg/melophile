<template>
  <div class="ListAlbum">
    <div v-if="album != null">
        <h1 @click="routeAlbum()">{{album.name}}</h1>
        <div class="flex sub-flex">
            <h2 @click="routeArtist(index)" v-for="(artist, index) in album.artists" :key="album._id + '-' + artist._id">{{artist.name + comma(index, album.artists.length)}}</h2>
        </div>
    </div>

  </div>
</template>

<script>

export default {
    name: 'ListAlbum',
    props: {
        album: Object,
    },
      methods: {
        routeAlbum() {
            this.$router.push('/album/' + this.album._id);
        },
        routeArtist(index) {
            this.$router.push('/artist/' + this.album.artists[index]._id);
        },
        comma(index, total) {
            if (index < total - 1)
                return ',';
            return '';
        }
    }
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
</style>