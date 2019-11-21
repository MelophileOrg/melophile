<template>
  <div id="main-flex" class="artistanalysis">
    <NavBar/>    
    <div id="main" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}">
      <ArtistHeader @changeTab="changeTab" :savedProcessed="savedProcessed" :color="color" :artistData="artistData"/>
      <div class="page" id="overview" v-if="tab == 0">
        <ArtistTopTracks :topTracks="topTracksLoaded" :override="topProcessed" :color="color"/>
        <!-- Top Track Analysis -->
        <!-- Genres -->
      </div>
      <div class="page" id="likedtracks" v-if="tab == 1">
        


      </div>

      <div class="page" id="comparison" v-if="tab == 2">

      
      </div>
<!-- 
      <div class="windows">
        
        <div class="window" :style="{'--delay': 0}">
          <div v-if="artistData != null" class="flex">
            <div class="flex">
              <div class="col">
                <div id="artist-image" :style="{backgroundImage: 'url(\'' + artistData.image + '\')'}"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name">{{artistData.name}}</h1>
                <h2>{{Math.round(artistData.popularity)}} / 100 Popularity</h2>
                <h2>{{formatNumber(artistData.followers)}} Followers</h2>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <div class="window" :style="{'--delay': 1}" v-if="progress.tracks">
          <div v-if="artistData != null" class="flex">
            <div class="flex">
              <div class="col">
                <div id="artist-image" class="library"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name">Liked Songs:</h1>
                <h2 v-if="timelineReady && !noneTimeline">First Liked: {{oldestLiked}}</h2>
                <h2 v-if="progress.tracks && !noneTimeline">{{songsSaved}}</h2>
                <h2 v-if="!progress.tracks">Finding Saved Songs...</h2>
                <h4 id="nosongs" v-if="noneTimeline">No Songs Liked</h4>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <FeaturedTracks type="track" secondary="popularity" :style="{'--delay': + 4}" class="featuredtracks" :saved="false" :none="false" :override="topTracksReady" title="Artist Top Tracks:" :ids="topTracks"/>

        <FeaturedTracks type="genre" secondary="" :style="{'--delay': + 5}" class="featuredtracks" :saved="false" :none="false" :override="artistData != null" title="Artist Genres:" :ids="genresComputed"/>

        <div class="window" :style="{'--delay': + 2}">
          <h3  class="window-title" v-if="artistData != null">Top Track's Characteristics:</h3>
          <div v-if="topTracksReady">
            <div>
              <PercentBar title="Happiness" :percent="sumTop('valence')" :color="audioFeatures.valence.color" />
              <PercentBar title="Energy" :percent="sumTop('energy')" :color="audioFeatures.energy.color" />
              <PercentBar title="Danceability" :percent="sumTop('danceability')" :color="audioFeatures.danceability.color" />
            </div>
          </div>
          <Loading v-else/>
        </div>

        <Timeline :none="noneTimeline" :small="true" :override="timelineReady" title="When You Liked Tracks:" instructions="" :max="-1" :delay="3" :bars="datesAdded" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>

        <div class="window" :style="{'--delay': + 6}">
          <h3  class="window-title" v-if="artistData != null">Liked Track's Characteristics:</h3>
          <div v-if="audioFeaturesReady">
            <div v-if="!none">
              <PercentBar title="Happiness" :percent="artistData.valence" :color="audioFeatures.valence.color" />
              <PercentBar title="Energy" :percent="artistData.energy" :color="audioFeatures.energy.color" />
              <PercentBar title="Danceability" :percent="artistData.danceability" :color="audioFeatures.danceability.color" />
            </div>
            <h4 v-else>No Songs Liked</h4>
          </div>
          <Loading class="displace" v-else/>
        </div>

        <Graph :zero="notSaved" :override="progress.tracks" title="Liked Tracks Happiness:" :delay="7" :bars="cleanGraphDataForwards(audioFeaturesGraphs.valence)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph :zero="notSaved" :override="progress.tracks" title="Liked Tracks Energy:" :delay="8" :bars="cleanGraphDataForwards(audioFeaturesGraphs.energy)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph :zero="notSaved" :override="progress.tracks" title="Liked Tracks Danceability:" :delay="9" :bars="cleanGraphDataForwards(audioFeaturesGraphs.danceability)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>

        <FeaturedTracks type="track" secondary="date" :style="{'--delay': + 11}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="Recently Liked Tracks:" :ids="newestTracks"/>

        <FeaturedTracks type="track" secondary="date" :style="{'--delay': + 10}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="Oldest Liked Tracks:" :ids="oldestTracks"/>

        
        

      </div> -->

      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import analyze from 'rgbaster';

import NavBar from '@/components/Navigation/NavBar.vue'
import Progress from '@/components/General/Progress.vue'
import ArtistHeader from '@/components/Artist/ArtistHeader.vue'
import ArtistTopTracks from '@/components/Artist/ArtistTopTracks.vue'

export default {
  name: 'artistanalysis',
  components: {
      NavBar,
      ArtistHeader,
      ArtistTopTracks,
      Progress,
  },
  data() {
      return {
        artistData: null,

        color: {r: 0, g: 0, b: 0, a: 0},

        audioFeaturesGraphs: {
          valence: [0,0,0,0,0,0,0,0,0,0],
          energy: [0,0,0,0,0,0,0,0,0,0],
          danceability: [0,0,0,0,0,0,0,0,0,0],
        },

        artistProcessed: false,
        topProcessed: false,
        savedProcessed: false,

        tab: 0,
        interval: null,
      }
  },
  methods: {
    changeTab(val) {
      console.log(this.artistData);
      this.tab = val;
    },
    async dominantColor(image) {
      let result = await analyze(image);
      let re = RegExp(/\d+/i, 'g');
      this.color.r = parseInt(re.exec(result[0].color), 10);
      this.color.g = parseInt(re.exec(result[0].color), 10);
      this.color.b = parseInt(re.exec(result[0].color), 10);
      this.color.a = .4;
    },
    async retrieveArtistData() {
      let spotifyData = await this.$store.dispatch("getArtist", this.$route.params.id);
      if ('images' in spotifyData && spotifyData.images.length > 0)
        this.dominantColor(spotifyData.images[0].url);
      let discogsData = await axios.get('/api/discogs/artist/' + spotifyData.name);
      this.artistData = await this.processArtist(spotifyData, discogsData.data);
      this.artistProcessed = true;
      await this.getTopTracks();
      this.topProcessed = true;
      this.interval = setInterval(this.checkTracks, 500);
    },
    processArtist(artist, discogs) {
      console.log(artist);
      console.log(discogs);
      let artistObject = Object.assign({}, artist);
      artistObject.images = [artistObject.images[0].url];
      if ('images' in discogs)
        if (discogs.images.length > 0)
          for (let i = 0; i < discogs.images.length; i++) {
            artistObject.images.push(discogs.images[i].resource_url);
          }
      artistObject.members = [];
      if ('members' in discogs)
        artistObject.members = discogs.members;
      artistObject.namevariations = [];
      if ('namevariations' in discogs);
        artistObject.namevariations = discogs.namevariations;
      artistObject.profile = "";
      if ('profile' in discogs);
        artistObject.profile = discogs.profile;
      artistObject.realname = "";
      if ('realname' in discogs);
        artistObject.realname = discogs.realname;
      artistObject.website = "";
      artistObject.facebook = "";
      artistObject.instagram = "";
      artistObject.youtube = "";
      if ('urls' in discogs)
        for (let i = 0; i < discogs.urls.length; i++) {
          if (discogs.urls[i].includes('facebook'))
            artistObject.facebook = discogs.urls[i];
          else if (discogs.urls[i].includes('instagram'))
            artistObject.instagram = discogs.urls[i];
          else if (discogs.urls[i].includes('youtube'))
            artistObject.youtube = discogs.urls[i];
          else if (i == 0) 
            artistObject.website = discogs.urls[i];
        }
      artistObject.timeline = [];
      artistObject.oldest = [];
      artistObject.newest = [];
      artistObject.savedTracks = {tracks: [], energy: 0, valence: 0, danceability: 0};
      artistObject.topTracks = {tracks: [], energy: 0, valence: 0, danceability: 0};
      
      return artistObject;
    },
    async checkTracks() {
      if (this.progress.tracks) {
        clearInterval(this.interval);
        this.artistData.savedTracks.tracks = await this.artistTracks();
        await this.processTracks();
        this.savedProcessed = true;
      }
    },
    async artistTracks() {
      if (!(this.artistData.id in this.$store.state.artists))
        return [];
      let ids = this.$store.state.artists[this.artistData.id].tracks;
      let tracks = [];

      let now = new Date();
      let nowTime = now.getTime();
      const MONTH = 2626560000;

      let orderByDate = [];
      for (let i = 0; i < ids.length; i++) {
          tracks.push(this.$store.state.tracks[ids[i]]);
          let date = new Date(tracks[i].date);
          let dateTime = date.getTime();
          let diff = nowTime - dateTime;
          let diffMonth = Math.floor(diff / MONTH);
          orderByDate.push({id: tracks[i], time: dateTime, month: diffMonth});
          if (diffMonth >= this.artistData.timeline.length) {
              while (diffMonth >= this.artistData.timeline.length) {
                  this.artistData.timeline.push(0);
              }
          }
          this.artistData.timeline[diffMonth] += 1;
      }
      orderByDate.sort((a, b) => (a.time > b.time) ? 1 : -1);
      let num = orderByDate.length;
      if (orderByDate.length > 10) 
        num = 10;
      
      this.artistData.oldest = orderByDate.slice(0, num);
      this.artistData.newest = orderByDate.slice(orderByDate.length - num, orderByDate.length);
      while (this.artistData.timeline.length < this.$store.state.dateAdded.length) {
          this.artistData.timeline.push(0);
      }
      return tracks;
    },
    async processTracks() { 
      let ids = this.artistData.savedTracks.tracks.map(value => value.id);
      let keys = ['valence', 'danceability', 'energy'];

      while (ids.length > 0) {
        let newIds = ids.splice(0, 50);
        let audioFeatures = await this.$store.dispatch('getAudioFeaturesForTracks', newIds);
        for (let i = 0; i < audioFeatures.length; i++) {
          for (let j = 0; j < keys.length; j++) {
            this.artistData.savedTracks[keys[j]] += audioFeatures[i][keys[j]];
            this.audioFeaturesGraphs[keys[j]][Math.floor(audioFeatures[i][keys[j]] * 10)] += 1;
          }
        }
      }
      for ( let i = 0; i < keys.length; i++) {
        this.artistData.savedTracks[keys[i]] = this.artistData.savedTracks[keys[i]] / this.artistData.savedTracks.tracks.length;
      }
    },
    async artistTopTracks() {
        let tracks = await this.$store.dispatch('getArtistTopTracks', this.$route.params.id);
        let ids = [];
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].album.images.length > 1)
                tracks[i].image = tracks[i].album.images[0].url;
            ids.push(tracks[i].id);
        }
        let audioFeatures = await this.$store.dispatch('getAudioFeaturesForTracks', ids);
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].valence = audioFeatures[i].valence;
            tracks[i].energy = audioFeatures[i].energy;
            tracks[i].danceability = audioFeatures[i].danceability;
        }
        return tracks;
    },

    async getTopTracks() {
      let tracks = await this.artistTopTracks();
      for (let i = 0; i < tracks.length; i++) {
        this.artistData.topTracks.tracks.push(tracks[i]);
        this.artistData.topTracks.valence += tracks[i].valence;
        this.artistData.topTracks.energy += tracks[i].energy;
        this.artistData.topTracks.danceability += tracks[i].danceability;
        this.artistData.topTracks.tracks[i].image = this.artistData.topTracks.tracks[i].album.images[0].url;
      }
      this.artistData.topTracks.valence /= this.artistData.topTracks.tracks.length;
      this.artistData.topTracks.energy /= this.artistData.topTracks.tracks.length;
      this.artistData.topTracks.danceability /= this.artistData.topTracks.tracks.length;
      this.topTracksReady = true;
    },

    cleanGraphDataForwards(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    formatNumber(num) {
      let millions = Math.floor(num / 1000000);
      let thousands = Math.floor(num / 1000) % 1000;
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

    sumTop(type) {
      let sum = 0;
      for (let i = 0; i < this.artistData.topTracks.length; i++) {
        sum += this.artistData.topTracks[i][type];
      }
      return sum / this.artistData.topTracks.length;
    },
    cleanGraphData(bars) {
      let graphData = [];
      for (let i = bars.length - 1; i >= 0; i--) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    reverse(arr) {
      let newArr = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        newArr.push(arr[i]);
      }
      return newArr;
    },
    toTrack(id) {
      this.$router.push("/songs/" + id);
    }
  },
  computed: {
    red() {
      return this.color.r;
    },
    green() {
      return this.color.g;
    },
    blue() {
      return this.color.b;
    },
    alpha() {
      return this.color.a;
    },
    topTracksLoaded() {
      if (this.artistData == null) {
        return {tracks: [], valence: 0, energy: 0, danceability: 0};
      }
      return this.artistData.topTracks;
    },
    oldestLiked() {
      let month = this.oldestTracks[0].month;
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let now = new Date();
      let nowMonth = now.getMonth();
      let year = 0;
      nowMonth -= month;
      nowMonth -= 1;
      while (nowMonth < 0) {
          year += 1;
          nowMonth = 12 + nowMonth;
      } 
      let returnYear = (now.getFullYear() - year);
      return months[nowMonth] + ", " + returnYear;
    },
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    },
    notSaved() {
      if (!this.progress.tracks)
        return false;
      if (!(this.$route.params.id in this.$store.state.artists))
        return true;
      return this.$store.state.artists[this.$route.params.id].tracks.length == 0;
    },
    songsSaved() {
      if (this.$route.params.id in this.$store.state.artists) {
        return this.$store.state.artists[this.$route.params.id].tracks.length + " Songs Liked";
      }
      return "";
    },
    datesAdded() {
      if (!this.savedProcessed)
        return [];
      return this.cleanGraphData(this.artistData.timeline);
    },
    oldestTracks() {
      if (!this.savedProcessed)
        return [];
      return this.artistData.oldest;
    },
    newestTracks() {
      if (!this.savedProcessed)
        return [];
      return this.reverse(this.artistData.newest);
    },
    audioFeatures() {
      return this.$store.state.audioFeatures;
    },
    none() {
      if (this.savedProcessed) {
        if (this.artistData.tracks.length == 0) {
          return true;
        }
      }
      return false;
    },
    noneTimeline() {
      if (this.savedProcessed) {
        if (this.artistData.timeline.length == 0) {
          return true;
        }
      }
      return false;
    },
    genresComputed() {
      if (this.artistData != null)
        return this.artistData.genres.slice(0, 10);
      return [];
    },
  },  
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    if (!this.inicialized)
      this.$router.push("/login");
    // REQUEST Artist Data
    this.retrieveArtistData();
  }
}
/*

*/
</script>

<style scoped>
#main {
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 0;
  /* background: rgba(var(--red), var(--green), var(--blue), var(--alpha)); */
}
h1.section-title {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.815);
  font-weight: lighter;
  margin-bottom: 16px;
}

.sub-title {
  color: rgba(255, 255, 255, 0.945);
  font-weight: bold;
  font-size: 1.1em;
  margin: 0;
}

p {
  color: rgba(255, 255, 255, 0.534);
  text-align: left;
  margin: 0px 0px;
  line-height: 25px;
}

.member-active {
  display: block;
  height: 20px;
  width: 20px;
  margin: 0;
  margin-right: 5px;
}

img {
  max-width: 300px;
  max-height: 300px;
  margin: 0px 10px;
  border-radius: 5px;
}

#profile {
  max-width: 300px;
  margin: 0px 10px;
}

.top-track {
  display: flex;
  align-items: center;
  height: 45px;
}

.top-track p {
  width: calc(100% - 20px - 45px);
  display: block;
  line-height: 16px;
  height: 16px;
  color: white;
  text-align: left;
  font-weight: lighter;
  color: rgba(255, 255, 255, 0.699);
  margin-left: 16px;
}

.top-track .index {
  width: 20px;
  color: rgba(255, 255, 255, 0.349);
  text-align: center;
}

.border {
  height: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.219);
}

.bordertop {
  border-top: 1px solid rgba(255, 255, 255, 0.219);
}

.top-track .track-image {
  display: block;
  width: 45px;
  height: 45px;
  margin: 0;
  background-size: 100% 100%;
  background-position: center center;
  border: 1px solid rgba(0, 0, 0, 0.452);
}

#topTracksList {
  max-width: 400px;
}

.featuredtracks {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
}
.library {
  background-image: url('../../assets/icons/heart.svg');
}
#nosongs {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.336);
  padding: 10px;
  background-color: rgba(7, 7, 7, 0.336);
  border-radius: 10px;
}
.nomargin {
  margin-bottom: 0px;
}

@media screen and (max-width: 720px) {
  #artist-image {
    width: 70px !important;
    height: 70px !important;
    margin-right: 20px;
  }

  .fit {
    width: calc(100% - 90px) !important;
  }
}

@media screen and (max-width: 720px) {
  .windows {
    margin-top: 15px;
  }

  #track-image {
    width: 70px !important;
    height: 70px !important;
    margin-right: 20px;
  }

  h1 {
    font-size: 1.2em !important;
    
  }

  h2 {
      font-size: .8em !important;
      margin: 2px !important;
  }

  h4 {
    font-size: .9em !important;
  }

}

h4 {
  margin-bottom: 0px;
  color: rgba(255, 255, 255, 0.336);
  padding: 10px;
  background-color: rgba(7, 7, 7, 0.336);
  border-radius: 10px;
}

#artist-image {
  display: block;
  width: 100px;
  height: 100px;
  background-size: auto 100%;
  background-position: center center;
  margin-right: 20px;
}


h1 {
  font-size: 1.7em;
  display: block;
  color: white;
  text-align: left;
  margin: 0px 0px;
  line-height: 30px;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 3px;
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

.fit {
  display: block;
  width: calc(100% - 120px);
}

.flex {
  width: 100%;
}

</style>