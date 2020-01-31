<template>
  <div class="ListArtist">
    <div v-if="artist != null">
        <h1 @click="routeArtist()">{{artist.name}}</h1>
        <div class="flex sub-flex" v-if="!trackNum && artist.genres.length > 0">
            <h2 @click="routeGenre(index)" v-for="(genre, index) in genres" :key="artist._id + '-' + genre">{{genre + comma(index, genres.length)}}</h2>
        </div>
        <h2 class="empty" v-if="!trackNum && artist.genres.length == 0">No Genres</h2>
        <div class="flex sub-flex" v-if="trackNum">
          <h2>{{formatNumber(artist.track_num)}} Tracks</h2>
        </div>
        
    </div>
  </div>
</template>

<script>

export default {
    name: 'ListArtist',
    props: {
        artist: Object,
        trackNum: Boolean,
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
      },
      formatNumber(val) {
        if (val == null) return "0";
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    computed: {
      genres() {
        let desired = 3;
        let newGenres = [];
        if (this.artist.genres.length < desired) desired = this.artist.genres.length;
        for (let i = 0; i < desired; i++) newGenres.push(this.artist.genres[i]);
        return newGenres;
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
  font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
  text-overflow: ellipsis;
}

h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    text-transform: capitalize;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    margin-right: 5px;
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