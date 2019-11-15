<template>
  <div id="main-flex" class="artistanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
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

        <Spotlight :profile="true" :delay="4" :numOff="false" :override="topTracksReady" title="Artist Top Tracks:" :list="topTracks" image="set"/>

        <Spotlight :delay="5" :numOff="true" :override="artistData != null" title="Artist Genres:" :list="genresComputed" image=""/>

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

        <FeaturedTracks type="track" :style="{'--delay': + 11}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="Recently Liked Tracks:" :ids="newestTracks"/>

        <FeaturedTracks type="track" :style="{'--delay': + 10}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="Oldest Liked Tracks:" :ids="oldestTracks"/>

        
        

      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import Loading from '@/components/General/Loading.vue'
import GoBackSearch from '@/components/Lists/GoBackSearch.vue'
import Timeline from '@/components/Windows/Timeline.vue'
import FeaturedTracks from '@/components/Windows/FeaturedTracks.vue'
import PercentBar from '@/components/Analysis/PercentBar.vue'
import Spotlight from '@/components/Windows/Spotlight.vue'
import Graph from '@/components/Windows/Graph.vue'

export default {
  name: 'artistanalysis',
  components: {
      NavBar,
      Loading,
      GoBackSearch,
      Timeline,
      FeaturedTracks,
      PercentBar,
      Spotlight,
      Graph
  },
  data() {
      return {
        artistData: null,
        libraryLoaded: false,
        interval: null,
        timelineReady: false,
        audioFeaturesReady: false,
        topTracksReady: false,
        audioFeaturesGraphs: {
          valence: [0,0,0,0,0,0,0,0,0,0],
          energy: [0,0,0,0,0,0,0,0,0,0],
          danceability: [0,0,0,0,0,0,0,0,0,0],
        }
      }
  },
  methods: {
    async artistAnalysis(id) {
        let artist = await this.$store.dispatch("getArtist", id);
        let artistObject = await this.processArtist(artist);
        return artistObject;
    },
    async processArtist(artist) {
        artist.href = artist.external_urls.spotify;
        delete artist.external_urls;
        artist.followers = artist.followers.total;
        artist.image = artist.images[0].url;
        delete artist.images;
        return artist;
    },
    async artistTracks(artistData) {
        if (!(artistData.id in this.$store.state.artists))
            return [];
        let ids = this.$store.state.artists[artistData.id].tracks;
        let tracks = [];
        for (let i = 0; i < ids.length; i++) {
            tracks.push(this.$store.state.tracks[ids[i]]);
        }
        return tracks;
    },
    async artistTimeline(artistData) {
        if (!(artistData.id in this.$store.state.artists))
            return {timeline: [], oldest: [], newest: []};
        let artistObject = artistData;
        let timeline = [];
        let tracks = [];
        let now = new Date();
        let nowTime = now.getTime();
        const MONTH = 2626560000;
        let artistSaved = this.$store.state.artists[artistObject.id];
        for (let i = 0; i < artistSaved.tracks.length; i++) {
            let date = new Date(this.$store.state.tracks[artistSaved.tracks[i]].date);
            let dateTime = date.getTime();
            let diff = nowTime - dateTime;
            let diffMonth = Math.floor(diff / MONTH);
            tracks.push({id: artistSaved.tracks[i], time: dateTime, month: diffMonth});
            if (diffMonth >= timeline.length) {
                while (diffMonth >= timeline.length) {
                    timeline.push(0);
                }
            }
            timeline[diffMonth] += 1;
        }
        tracks.sort((a, b) => (a.time > b.time) ? 1 : -1);
        let oldest = tracks.slice(0, 4);
        let newest = tracks.slice(tracks.length - 4, tracks.length);
        while (timeline.length < this.$store.state.dateAdded.length) {
            timeline.push(0);
        }
        return {timeline: timeline, oldest: oldest, newest: newest};
    },
    async artistTopTracks(id) {
        let tracks = await this.$store.dispatch('getArtistTopTracks', id);
        let ids = [];
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].album.href = tracks[i].album.external_urls.spotify;
            tracks[i].href = tracks[i].external_urls.spotify;
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
    async checktracks() {
      if (this.progress.tracks) {
        let response = await this.artistTracks(this.artistData);
        this.artistData.tracks = response;
        this.processTracks();
        response = await this.artistTimeline(this.artistData);
        this.artistData.timeline = response.timeline;
        this.artistData.oldest = response.oldest;
        this.artistData.newest = response.newest;
        clearInterval(this.interval);
        this.timelineReady = true;
      }
    },
    sumTop(type) {
      let sum = 0;
      for (let i = 0; i < this.artistData.topSongs.length; i++) {
        sum += this.artistData.topSongs[i][type];
      }
      return sum / this.artistData.topSongs.length;
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
    async processTracks() { 
      let ids = this.artistData.tracks.map(value => value.id);
      let averages = {valence: 0, danceability: 0, energy: 0};
      let keys = Object.keys(averages);

      while (ids.length > 0) {
        let newIds = ids.splice(0, 50);
        let audioFeatures = await this.$store.dispatch('getAudioFeaturesForTracks', newIds);
        console.log(audioFeatures);
        for (let i = 0; i < audioFeatures.length; i++) {
          for (let j = 0; j < keys.length; j++) {
            averages[keys[j]] += audioFeatures[i][keys[j]];
            this.audioFeaturesGraphs[keys[j]][Math.floor(audioFeatures[i][keys[j]] * 10)] += 1;
          }
        }
      }
      for ( let i = 0; i < keys.length; i++) {
        averages[keys[i]] = averages[keys[i]] / this.artistData.tracks.length;
        this.artistData[keys[i]] = averages[keys[i]];
      }
      this.audioFeaturesReady = true;
    },
    async getTopSongs() {
      this.artistData.topSongs = await this.artistTopTracks(this.$route.params.id);
      for (let i = 0; i < this.artistData.topSongs.length; i++) {
        try {
          this.artistData.topSongs[i].image = this.artistData.topSongs[i].album.images[0].url;
        } catch(error) {
          this.artistData.topSongs[i].image = "";
        }
      }
      this.topTracksReady = true;
    },
  },
  computed: {
    topTracks() {
      if (this.topTracksReady) {
        return this.artistData.topSongs.slice(0, 4);
      }
      return [];
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
      if (!this.timelineReady)
        return [];
      return this.cleanGraphData(this.artistData.timeline);
    },
    oldestTracks() {
      if (!this.timelineReady)
        return [];
      return this.artistData.oldest;
    },
    newestTracks() {
      if (!this.timelineReady)
        return [];
      return this.reverse(this.artistData.newest);
    },
    audioFeatures() {
      return this.$store.state.audioFeatures;
    },
    none() {
      if (this.audioFeaturesReady) {
        if (this.artistData.tracks.length == 0) {
          return true;
        }
      }
      return false;
    },
    noneTimeline() {
      if (this.timelineReady) {
        if (this.artistData.timeline.length == 0) {
          return true;
        }
      }
      return false;
    },
    genresComputed() {
      if (this.artistData != null)
        return this.artistData.genres.slice(0, 4);
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
    this.artistData = await this.artistAnalysis(this.$route.params.id);
    this.getTopSongs();
    if (this.progress.tracks) {
      let response = await this.artistTracks(this.artistData);
      this.artistData.tracks = response;
      this.processTracks();
      response = await this.artistTimeline(this.artistData);
      this.artistData.timeline = response.timeline;
      this.artistData.oldest = response.oldest;
      this.artistData.newest = response.newest;
      this.timelineReady = true;
    }
    else {
      this.interval = setInterval(this.checktracks, 2000);
    }  
  }
}
/*

*/
</script>

<style scoped>

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