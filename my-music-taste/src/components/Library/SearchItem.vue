<template>
  <div class="searchitem">
    <div class="search-song" :style="{'--delay': index}">
      <h1 v-if="showNum">{{index + 1}}</h1>
      <div>
        <div class="search-image" v-if="type == 'track' && saved" :style="{backgroundImage: 'url(\'' + data.image + '\')'}"/>
        <div class="search-image" v-if="type == 'track' && !saved" :style="{backgroundImage: 'url(\'' + data.album.images[0].url + '\')'}"/>
        <div class="search-image" v-if="type == 'artist'" :style="{backgroundImage: 'url(\'' + data.image + '\')'}"/>
        <div class="search-image genre" v-if="type == 'genre'"/>
      </div>
      <div class="info">

        <h1 @click="selectTrack(data.id)" class="search-title" :class="{cap: type == 'genre'}" >{{data.name}}</h1>

        <div v-if="type == 'track'" class="artists">
          <div v-for="artistnum in 4" :key="data.name + '-' + (artistnum - 1)">
            <h4 class="artist" @click="selectSpecial((artistnum - 1))" v-if="(artistnum - 1) < data.artists.length && !saved">{{data.artists[(artistnum - 1)].name}}{{comma((artistnum - 1), data.artists.length - 1)}}</h4>
            <h4 class="artist" @click="selectSpecial((artistnum - 1))" v-if="(artistnum - 1) < data.artists.length && saved">{{artists[data.artists[(artistnum - 1)]].name}}{{comma((artistnum - 1), data.artists.length - 1)}}</h4>
          </div>
        </div>
        <div v-if="type == 'genre'" class="artists">
          <div>
            <h4 class="artist">{{data.tracknum}} Songs</h4>
          </div>
        </div>
        <div v-if="type == 'artist' && topsaved == true" class="artists">
          <div>
            <h4 class="artist">{{data.tracks.length}} Songs</h4>
          </div>
        </div>
        <div v-if="type == 'artist' && topsaved != true" class="artists">
          <div v-for="artistnum in 4" :key="data.name + '-' + (artistnum - 1)">
            <h4  @click="selectSpecial((artistnum - 1))" class="artist" v-if="(artistnum - 1) < data.genres.length">{{data.genres[(artistnum - 1)]}}{{comma((artistnum), data.genres.length - 1)}}</h4>
          </div>
          <div v-if="data.genres.length == 0">
            <h4 class="artist" >No Genres Provided</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchitem',
  components: {
  },
  props: {
    type: String,
    data: Object,
    index: Number,
    showNum: Boolean,
    saved: Boolean,
    topsaved: Boolean,
  },
  methods: {
    selectTrack(id) {
      console.log(id);
      if (this.type == "track")
        this.$router.push("/songs/" + id);
      if (this.type == "artist")
        this.$router.push("/artists/" + id);
      if (this.type == "genre")
        this.$router.push("/genres/" + this.data.name);
    },
    selectSpecial(index) {
      if (this.type == "track")
        this.$router.push("/artists/" + this.data.artists[index].id);
      if (this.type == "artist")
        this.$router.push("/genres/" + this.data.genres[index].name);
      if (this.type == "genre")
        return
    },
    comma(num, total) {
      if (num == 4) {
        return "";
      }
      if (num < total) {
        return ",";
      }
      return "";
    }
  },
  computed: {
    artists() {
      return this.$store.state.artists;
    }
  },
  created() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cap {
  text-transform: capitalize;
}

.search-song {
  cursor: pointer;
  --delay: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 3px 0px;
  font-family: 'Roboto', sans-serif;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s) linear;
}

.scroll {
  margin-left: 10px;
  width: calc(100% - 95px) !important;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

.space {
  margin: 0;
  margin-right: 7px;
}

.artists .artist {
  display: block;
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}

.artists .artist:hover {
  text-decoration: underline;
}

.artists {
  display: flex;
  align-items: center;
  margin: 0;
  margin-left: 11px;
  max-width: 100%;
}

.genre {
  background-image: url('../../assets/icons/genres.svg');
}

.search-image {
  display: block;
  width: 60px;
  height: 60px;
  background-size: auto 100%;
  margin-right: 5px;
  background-position: center center;
}

.search-title {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.info {
  display: block;
  width: calc(100% - 100px);
  position: relative;
  overflow: hidden;
}

.search-song .search-title:hover 
{
  text-decoration: underline;
}

h1 {
  color: rgba(255, 255, 255, 0.288);
  margin: 0;
  font-size: 1.2em;
  text-align: center;
  width: 25px;
  margin-right: 10px;
}

@media only screen and (max-width: 720px) {
  h1 {
    font-size: 1em;
    margin: 0;
  }

  .search-title {
    font-size: 20px;
  }

  .search-image {
    width: 50px;
    margin-left: 10px;
    height: 50px;
  }

  .search-song {
    padding: 15px 5px;
  }
}
</style>