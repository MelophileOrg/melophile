<template>
  <div class="mycharts maindiv">
    <NavBar path="mycharts" />
    <div id="main">
      <AppTitle v-if="load" title="My Charts" image="chart" font="Monoton"/>
      <div :class="{load: load}" id="options">
        <h1>my top</h1>
        <Select @pending="pending('type')" @selection="typeSelected" :setTitle="overrideTyp.title" :override="overrideTyp.set" :load="load" :options="types"/>
        <h1>in the last</h1>
        <Select @pending="pending('range')" @selection="rangeSelected" :setTitle="overrideRan.title" :override="overrideRan.set" :load="load" :options="ranges"/>
      </div>
      <div class="loading" v-if="show && artists.length == 0 && tracks.length == 0">
        <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
      </div>
      <table class="table" v-if="(type == null || range == null) && !load">
        <tr class="loadingspace" v-for="num in 10" :key="'loading-spaces'+num" :style="{'--delay': + num}">
          <a class="row fake"/>
        </tr>
      </table>
      <table class="table" id="artists" v-if="show && artists.length != 0">
        <tr class="artist" v-for="(artist, index) in artists" :key="artist.id" :style="{'--delay': + index}">
          <a class="row">
          <td>
            <h2>{{index + 1}}</h2>
          </td>
          <td>
            <div class="image" :style="{backgroundImage: 'url(\'' + artist.images[0].url + '\')'}"/>
          </td>
          <td>
            <h1>{{artist.name}}</h1>
            <div class="genres">
              <div class="genre-div" v-for="index in 4" :key="artist.name + '-' + (index - 1)">
                <h4 class="genre" v-if="(index - 1) < artist.genres.length">{{artist.genres[(index - 1)]}}<h4 class="comma" v-if="(index - 1) < artist.genres.length - 1">, </h4></h4>
              </div>  
            </div>
          </td>
          </a>
        </tr>
      </table>
      <table class="table" id="tracks" v-if="show && tracks.length != 0">
        <tr class="track" v-for="(track, index) in tracks" :key="track.id" :style="{'--delay': + index}">
          <a class="row">
          <td>
            <h2>{{index + 1}}</h2>
          </td>
          <td>
            <div class="image" :style="{backgroundImage: 'url(\'' + track.album.images[0].url + '\')'}"/>
          </td>
          <td>
            <h1>{{track.name}}</h1>
            <div class="artists">
              <div class="artist-div" v-for="index in 4" :key="track.name + '-' + (index - 1)">
                <a  class="artist" v-if="(index - 1) < track.artists.length">{{track.artists[(index - 1)].name}}<h4 class="comma" v-if="(index - 1) < track.artists.length - 1">, </h4></a>
              </div>  
            </div>
          </td>
          </a>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Select from '@/components/Select.vue'
import AppTitle from '@/components/AppTitle.vue'

export default {
  name: 'mycharts',
  components: {
    NavBar,
    Select,
    AppTitle
  },
  data() {
    return {
      overrideTyp: {
        set: false,
        title: "",
      },
      overrideRan: {
        set: false,
        title: "",
      },
      types: [
        {value: "tracks", text: "Tracks"},
        {value: "artists", text: "Artists"},
      ],
      ranges: [
        {value: "short_term", text: "4 Weeks"},
        {value: "medium_term", text: "6 Months"},
        {value: "long_term", text: "Few Years"},
      ],
      type: null,
      range: null,
      tracks: [],
      artists: [],
      show: false,
      load: true,
    }
  },
  methods: {
    pending(select) {
      this.show = false;
      this.tracks = [];
      this.artists = [];
      if (select == 'type')
        this.type = null;
      if (select == 'range')
        this.range = null;
    },
    typeSelected(type) {
      this.type = type;
      this.checkShow();
    },
    rangeSelected(range) {
      this.range = range;
      this.checkShow();
    },
    checkShow() {
      if (this.type != null && this.range != null)
      {
        this.load = false;
        this.overrideRan.title = this.range;
        this.overrideTyp.title = this.type;
        this.overrideRan.set = true;
        this.overrideTyp.set = true;
        if (this.type == "tracks")
          this.retrieveTracks();
        else
          this.retrieveArtists();
        this.overrideRan.set = false;
        this.overrideTyp.set = false;
      }
    },
    async retrieveTracks() {
      this.show = true;
      this.tracks = await this.$store.dispatch('getTopTracks',{limit: 50, time_range: this.range});
      
    },
    async retrieveArtists() {
      this.show = true;
      this.artists = await this.$store.dispatch('getTopArtists',{limit: 50, time_range: this.range});
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>


a.row {
  text-decoration: none;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 0px 32px;
  border-radius: 0px;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
}



@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');



.table {
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  margin-bottom: 100px;
}

tr {
  --delay: 0;
  overflow: hidden;
  position: relative;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s) linear;
  border: 1px solid rgba(255, 255, 255, 0.116);
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

.comma {
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 12px;
  margin: 0;
  margin-right: 7px;
}

.genres .genre {
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 15px;
  margin: 0;
}

.genres {
  display: flex;
  margin-left: 13px;
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
  margin-left: 13px;
}

.loadingspace {
  --delay: 0;
  margin-left: 13px;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s) linear, throb-row 2s ease-in-out calc(var(--delay) * .23s + var(--delay) * .1s + .5s) infinite;
}

@keyframes throb-row {
  0%{
    opacity: 1;
  }
  50%{
    opacity: .3;
  }
  100%{
    opacity: 1;
  }
}

@media screen and (min-width: 500px) {
  .load#options {
    margin-top: 0vh !important;
  }
}

.load#options {
  margin-top: 40px;
}

#options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 32px auto;
  margin-top: 40px;
  animation: slide-up .3s ease .3s, peekaboo .3s linear;
}

#options h1 {
  color: rgba(252, 252, 252, 0.301);
  text-shadow: 1px 1px 10px rgba(255, 255, 255, 0.075);
  font-size: 40px;
  font-weight: lighter;
  margin: 0px 15px;
  font-family: 'Bitter', serif;
  font-family: 'Roboto', sans-serif;
}

.row h1 {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
}


.row h2 {
  color: rgb(250, 250, 250);
  margin: 0 10px 0px 0px;
  font-weight: bolder;
  font-size: 20px;
  width: 20px;
}


.image {
  display: block;
  width: 60px;
  height: 60px;
  background-size: auto 100%;
  background-position: center center;
}




</style>