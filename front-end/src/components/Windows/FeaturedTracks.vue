<template>
  <div class="featuredtracks window">
      <h3 class="window-title">{{title}}</h3>
      <Loading class="displace" v-if="!override && !none"/>
      <div class="overflow" v-if="override && !none && saved">
          <div @click="toSong(id.id)" v-for="id in ids" :key="title + id.id" class="search-song ">
              <div class="search-image" :style="{backgroundImage: 'url(\'' + tracks[id.id].image + '\')'}"/>
              <div class="col">
                  <h1 class="search-title">{{tracks[id.id].name}}</h1>
                  <h4 v-if="secondary == 'date'">{{findDate(id)}}</h4>
              </div>
          </div>
      </div>

      <div class="overflow" v-if="override && !none && !saved && type == 'track'">
        <div @click="toSong(track.id)" v-for="track in ids" :key="title + track.id" class="search-song ">
          <div class="search-image" :style="{backgroundImage: 'url(\'' + track.image + '\')'}"/>
          <div class="col">
            <h1 class="search-title">{{track.name}}</h1>
            <h4 v-if="secondary == 'album'">{{track.album.name}}</h4>
            <h4 v-if="secondary == 'popularity'">{{track.name}}</h4>
          </div>
        </div>
      </div>

      <div class="overflow" v-if="override && !none && !saved && type == 'artist'">
        <div @click="toArtist(item.id)" v-for="item in ids" :key="title + item.id" class="search-song ">
          <div class="search-image" :style="{backgroundImage: 'url(\'' + item.image + '\')'}"/>
          <div class="col">
            <h1 class="search-title">{{item.name}}</h1>
            <h4 v-if="secondary == 'genre'">{{item.genres[0]}}</h4>
            <h4 v-if="secondary == 'trackNum'">{{item.tracks.length}}</h4>
          </div>
        </div>
      </div>

      <div class="overflow" v-if="override && !none && !saved && type == 'genre'">
        <div @click="toGenre(item)" v-for="item in ids" :key="title + item" class="search-song genre">
          <div class="search-image"/>
          <div class="col">
            <h1 class="search-title">{{item}}</h1>
            <h4 v-if="secondary == 'trackNum'">{{item.trackNum}}</h4>
          </div>
        </div>
      </div>
    
      <h5 v-if="ids.length == 0 && type == 'track'">No Tracks</h5>
      <h5 v-if="ids.length == 0 && type == 'artist'">No Artists</h5>
      <h5 v-if="ids.length == 0 && type == 'genre'">No Genres Listed</h5>

  </div>
</template>

<script>
import Loading from '@/components/General/Loading.vue'

export default {
    name: 'featuredtracks',
    components: {
        Loading,
    },
    props: {
      title: String,
      ids: Array,
      type: String,
      secondary: String,
      override: Boolean,
      none: Boolean,
      saved: Boolean,
      delay: Number,
    },
    methods: {
      toSong(id) {
          this.$router.push('/songs/' + id);
      },
      toArtist(id) {
          this.$router.push('/artist/' + id);
      },
      toGenre(id) {
          this.$router.push('/genres/' + id);
      },
      findDate(object) {
          let now = new Date();
          let nowMonth = now.getMonth();
          let year = 0;
          nowMonth -= object.month;
          nowMonth -= 1;
          while (nowMonth < 0) {
              year += 1;
              nowMonth = 12 + nowMonth;
          } 
          nowMonth += 1;
          let returnYear = (now.getFullYear() - year) % 100;
          return nowMonth + "/" + returnYear;
      },
    },
    computed: {
      tracks() {
          return this.$store.state.tracks;
      }
    },
    created() {
      console.log(this.ids);
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.track {
    width: 100%;
}

.window-title {
    margin-left: 20px !important;
}

@media only screen and (max-width: 720px) {
  .search-title {
    font-size: 16px !important;
    margin-left: 5px !important;
  }
  h4 {
      margin-left: 6px !important;
  }

  .featuredtracks.window {
    width: calc(75% + 45px) !important;
    padding: 20px 0px !important;
    padding-bottom: 0px !important;
    max-width: 460px !important;
  }

}

.search-song:hover .search-title
{
  text-decoration: underline;
}

.search-image {
  display: block;
  width: 50px !important;
  height: 50px;
  background-size: 100% auto;
  margin-right: 5px;
  background-position: center center;
  background-repeat: no-repeat;
}

.genre .search-image {
  background-image: url('../../assets/icons/genres.svg');
}

.search-title {
  color: white;
  margin: 0 10px;
  
  font-weight: lighter;
  font-size: 18px;
  text-align: left;
  width: calc(100% - 15px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.genre .search-title {
  text-transform: capitalize;
}

.search-song {
  cursor: pointer;
  --delay: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 0px auto;
  margin-bottom: 3px;
  font-family: 'Roboto', sans-serif;
  width: calc(100% - 20px);
}

h4 {
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
  max-width: 100%;
  text-align: left;
  margin-left: 11px;
}

h5 {
  font-size: 1em;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 0px;
  color: rgba(255, 255, 255, 0.336);
  padding: 10px;
  
  background-color: rgba(7, 7, 7, 0.336);
  border-radius: 10px;
}

.col {
    width: calc(100% - 20px - 50px);
}

.featuredtracks.window {
  width: calc(75% + 60px);
  padding: 20px 0px;
  padding-bottom: 0px;
  max-width: 460px;
}

.overflow {
  display: block;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* width */
.overflow::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.overflow::-webkit-scrollbar-track {
  background: #f1f1f100; 
}
 
/* Handle */
.overflow::-webkit-scrollbar-thumb {
  background: rgba(253, 255, 255, 0.411); 
}

/* Handle on hover */
.overflow::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

</style>