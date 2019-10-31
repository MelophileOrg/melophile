<template>
  <div id="main-flex" class="songanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

        <div id="song" class="window" :style="{'--delay': 0}">
          <h3>Song Details:</h3>
          <div v-if="trackData != null" class="flex">
            <div class="col">
                <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
            </div>
            <div  class="col fit">
                <h1>{{trackData.name}}</h1>
                <div id="artists">
                    <h3 v-for="artist in trackData.artists" :key="artist.name">{{artist.name}}</h3>
                </div>
                <h2>{{trackData.album.name}}</h2>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <div id="artist" class="window" :style="{'--delay': 1}">
          <h3>Artist Details:</h3>
          <div v-if="artistDone" class="flex">
            <div class="flex">
              <div class="col">
                <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.artist.images[0].url + '\')'}"/>
              </div>
              <div class="col fit">
                <h1>{{trackData.artist.name}}</h1>
                <h2 >{{formatNumber(trackData.artist.followers.total)}} Followers</h2>
                <h2 v-if="progress.artistsLoaded">{{songsSaved}}</h2>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>
        <div class="window" :style="{'--delay': + 0}">
          <h3>Characteristics:</h3>
          <PercentBar title="Happiness" :percent="trackData.valence.value" :color="audioFeatures.valence.color" />
          <PercentBar title="Energy" :percent="trackData.energy.value" :color="audioFeatures.energy.color" />
          <PercentBar title="Danceability" :percent="trackData.danceability.value" :color="audioFeatures.danceability.color" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Loading from '@/components/General/Loading.vue'
import GoBackSearch from '@/components/Library/GoBackSearch.vue'
import PercentBar from '@/components/Analysis/PercentBar.vue'

export default {
    name: 'songanalysis',
    components: {
        NavBar,
        GoBackSearch,
        Loading,
        PercentBar,
    },
    data() {
        return {
          trackData: null,
          artistDone: false,
        }
    },
    methods: {
      async getArtistDetails() {
        this.trackData.artist = await this.$store.dispatch('getArtist', this.trackData.artists[0].id);
        this.artistDone = true;
      },
      findArtistSongsSaved(artist) {
        if (artist in this.$store.state.artists)
          return this.$store.state.artists[artist].tracks.length + " Songs Saved";
        return "No Songs Saved";
      },
      formatNumber(num) {
        let millions = Math.floor(num / 1000000);
        let thousands = Math.floor(num / 1000);
        let remainder = num % 1000;
        let zeros = "";
        let zeros2 = "";
        if (thousands < 100)
            zeros2 += "0"
        if (thousands < 10)
            zeros2 += "0"
        if (remainder < 100)
            zeros += "0"
        if (remainder < 10)
            zeros += "0"
        if (millions > 0)
          return millions + "," + zeros2 + thousands + "," + zeros + remainder;
        if (thousands > 0) 
            return thousands + "," + zeros + remainder;
        return remainder;
      },
    },
    computed: {
      songsSaved() {
        if (this.trackData.artists[0].id in this.$store.state.artists) {
          return this.$store.state.artists[this.trackData.artists[0].id].tracks.length + " Songs Saved";
        }
        return "No Songs Saved";
      },
      progress() {
        return this.$store.state.progress;
      },
    },  
    async created() {
      this.trackData = await this.$store.dispatch('songAnalysis', this.$route.params.id);
      await this.getArtistDetails();
    }
}

</script>

<style scoped>
.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.fit {
  display: block;
  width: calc(100% - 120px) !important;
}

.window {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 22px 22px;
    padding: 20px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
}

h3 {
  margin: 5px;
  margin-top: 10px;
  color: white;
  animation: throb 2s ease 0s infinite;
}

.row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

#track-image {
    display: block;
    width: 100px;
    height: 100px;
    background-size: 100% auto;
    background-position: center center;
    margin-right: 20px;
}

h1 {
    font-size: 1.6em;
    display: block;
    color: white;
    text-align: left;
    margin: 0px 0px;
    line-height: 30px;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    
}

h2 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.568);
    text-align: left;
    margin: 0;
    margin-top: 10px;
    max-width: calc(100% - 5px);
    text-transform: capitalize;
        text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

#artists {
    display: flex;
    max-width: calc(100% - 5px);
    overflow: hidden;
}

#artists h3 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.927);
    text-align: left;
    margin: 0px 0px;
    margin-right: 5px;
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.window h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  color: white;
  margin-bottom: 15px;
}

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

p {
    margin: 0;
    color: white;
    text-align: left;
}

.flex {
    display: flex;
    width: 100%;
    align-items: center;
}

#artists {
    display: flex;
    max-width: calc(100% - 5px);
    overflow: hidden;
}

#artists h3 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.927);
    text-align: left;
    margin: 0px 0px;
    margin-right: 5px;
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>