<template>
  <div class="featuredtracks window">
      <h3 class="window-title">{{title}}</h3>
      <Loading class="displace" v-if="!override && !none"/>
      <div v-if="override && !none && saved">
          <div @click="toSong(id.id)" v-for="id in ids" :key="title + id.id" class="search-song ">
              <img class="search-image" :src="tracks[id.id].image"/>
              <div class="col">
                  <h1 class="search-title">{{tracks[id.id].name}}</h1>
                  <h4>{{findDate(id)}}</h4>
              </div>
          </div>
      </div>

      <div v-if="override && !none && !saved">
        <div @click="toSong(track.id)" v-for="track in ids" :key="title + track.id" class="search-song ">
          <img class="search-image" :src="track.image"/>
          <div class="col">
            <h1 class="search-title">{{track.name}}</h1>
            <h4>{{track.album.name}}</h4>
          </div>
        </div>
      </div>
    
      <h5 v-if="none">No Songs Liked</h5>

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
        override: Boolean,
        none: Boolean,
        saved: Boolean,
        delay: Number,
    },
    methods: {
        toSong(id) {
            this.$router.push('/songs/' + id);
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

.displace {
  transform: translateY(-25px);
}

@media only screen and (max-width: 720px) {
  .search-title {
    font-size: 16px !important;
    margin-left: 5px !important;
  }
  h4 {
      margin-left: 6px !important;
  }
  .col {
      width: calc(100% - 55px) !important;
  }

  .search-image {
    width: 35px !important;
    margin-left: 5px;
    height: 35px !important;
  }

  .search-song {
    padding: 5px 5px !important;
    width: calc(100% - 45px) !important;
  }
}

.search-song:hover .search-title
{
  text-decoration: underline;
}

.search-image {
  display: block;
  width: 35px;
  height: 35px;
  background-size: auto 100%;
  margin-right: 5px;
  background-position: center center;
}

.search-title {
  color: white;
  margin: 0 10px;
  
  font-weight: lighter;
  font-size: 18px;
  text-align: left;
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  
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
  height: 45px;
  margin: 3px auto;
  font-family: 'Roboto', sans-serif;
  width: calc(100% - 60px);
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
    width: calc(100% - 40px);
}

.featuredtracks.window {
  width: calc(75% + 40px);
  padding: 20px 0px;
  max-width: 440px;
}

</style>