<template>
  <div class="songanalysis">
    <NavBar path="songanalysis" />
    <div id="main">
      <SearchBar v-on:changed="search" />
      <div class="loading" v-if="!trackSelected && list.length == 0 && waiting && !empty">
        <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
      </div>
      <div id="no-results" v-if="!trackSelected && list.length == 0 && !waiting && !load && !empty">
        <h1>No Results Found</h1>
      </div>
      <div id="search" v-if="!trackSelected && list.length > 0">
        <table>
          <tr @click="selectTrack(track.id)" class="search-song" v-for="(track, index) in list" :key="track.id + index" :style="{'--delay': index}">
            <td>
              <div class="search-image" :style="{backgroundImage: 'url(\'' + track.album.images[0].url + '\')'}"/>
            </td>
            <td>
              <h1 class="search-title">{{track.name}}</h1>
              <div class="artists">
                <div v-for="index in 4" :key="track.name + '-' + (index - 1)">
                  <h4  class="artist" v-if="(index - 1) < track.artists.length">{{track.artists[(index - 1)].name}}<h4 class="space" v-if="(index - 1) < track.artists.length - 1"></h4></h4>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div id="analysis" v-if="trackSelected && data != null">
        <div id="track-image" :style="{backgroundImage: 'url(\'' + data.album.images[0].url + '\')'}"/>
        <h1>{{data.name}}</h1>
        <p>{{data}}</p>
        <div id="p5Canvas"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import SearchBar from '@/components/SearchBar.vue'

if (process.browser) {
  var analysis = require('@/js/Analysis.js')
}


export default {
  name: 'songanalysis',
  components: {
    NavBar,
    SearchBar
  },
  data() {
    return {
      trackSelected: false,
      list: [],
      data: null,
      promise: null,
      load: true,
      waiting: false,
      empty: true,
      setId: 0,

      trackId: "",
      data: null,
    }
  },
  methods: {
    async search(query) {
      if (query == "")
      {
        this.empty = true;
        this.trackSelected = false;
        this.waiting = false;
        this.list = [];
        return;
      }
      this.list = [];
      this.trackSelected = false;
      this.empty = false;
      this.load = false;
      this.waiting = true;
      this.setId += 1;
      let id = this.setId;
      this.promise = await this.$store.dispatch('searchSpotify', {query: query});
      if (id != this.setId)
      {
        return;
      }
      this.waiting = false;
      this.trackSelected = false;
      this.list = this.promise;
      this.promise = null;
    },
    async selectTrack(id) {
      this.load = false;
      this.trackSelected = true;
      this.trackId = id;
      this.data = null;
      this.data = await this.$store.dispatch('getTrack', this.trackId);
      this.data.audioFeatures = await this.$store.dispatch('getAudioFeaturesForTrack', this.trackId);
    },
    callbackOnP5: function(timeStr) {
      this.message = timeStr;
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  mounted() {
    const P5 = require('p5')
    new P5(analysis.main)
    // NOTE: p5.jsからのコールバックを受け取る
    analysis.setDelegate(this.callbackOnP5);
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>
#track-image {
  display: block;
  width: 200px;
  height: 200px;
  background-size: 100% 100%;
  border-radius: 5px;
}

#analysis {
  position: relative;
  display: block;
  width: calc(100% - 64px);
  margin: 32px;
  animation: slide-up .5s ease;
}

#analysis h1 {
  color: white;
  text-align: left;
}
.loading {
  margin-top: 100px;
}

#no-results h1 {
  color: rgba(255, 255, 255, 0.171);
  margin-top: 100px;
  font-weight: lighter;
}


.songanalysis {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

table {
  width: 100%;
}

.search-song {
  cursor: pointer;
  --delay: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 3px 0px;
  font-family: 'Roboto', sans-serif;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s) linear;
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
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 15px;
  margin: 0;
}

.artists {
  display: flex;
  margin: 0;
  margin-left: 13px;
}

.search-image {
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background-size: auto 100%;
  background-position: center center;
}

.search-title {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
}

.search-song:hover .search-title
{
  text-decoration: underline;
}
</style>