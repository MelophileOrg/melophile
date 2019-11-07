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

        <div class="window" :style="{'--delay': 1}" v-if="progress.tracksLoaded">
          <div v-if="artistData != null" class="flex">
            <div class="flex">
              <div class="col">
                <div id="artist-image" class="library"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name">Liked Songs:</h1>
                <h2 v-if="timelineReady && !noneTimeline">First Liked: {{oldestLiked}}</h2>
                <h2 v-if="progress.tracksLoaded && !noneTimeline">{{songsSaved}}</h2>
                <h2 v-if="!progress.tracksLoaded">Finding Saved Songs...</h2>
                <h4 id="nosongs" v-if="noneTimeline">No Songs Liked</h4>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>


        

        <div class="window" :style="{'--delay': + 3}">
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

        <Spotlight :delay="2" :numOff="true" :override="artistData != null" title="Artist Genres:" :list="genresComputed" image=""/>

        <FeaturedTracks :style="{'--delay': + 4}" class="featuredtracks" :saved="false" :none="false" :override="topTracksReady" title="Artist Top Tracks:" :ids="topTracks"/>

        <Timeline :none="noneTimeline" :small="true" :override="timelineReady" title="When You Liked Tracks:" instructions="" :max="-1" :delay="5" :bars="datesAdded" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>

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

        <Graph :zero="notSaved" :override="progress.tracksLoaded" title="Liked Tracks Happiness:" :delay="7" :bars="cleanGraphDataForwards(audioFeaturesGraphs.valence)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph :zero="notSaved" :override="progress.tracksLoaded" title="Liked Tracks Energy:" :delay="8" :bars="cleanGraphDataForwards(audioFeaturesGraphs.energy)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph :zero="notSaved" :override="progress.tracksLoaded" title="Liked Tracks Danceability:" :delay="9" :bars="cleanGraphDataForwards(audioFeaturesGraphs.danceability)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>

        <FeaturedTracks :style="{'--delay': + 10}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="First Liked Tracks:" :ids="oldestTracks"/>

        <FeaturedTracks :style="{'--delay': + 11}" class="featuredtracks" :saved="true" :none="noneTimeline" :override="timelineReady" title="Recently Liked Tracks:" :ids="newestTracks"/>
        

      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Loading from '@/components/General/Loading.vue'
import GoBackSearch from '@/components/Library/GoBackSearch.vue'
import Timeline from '@/components/Analysis/Timeline.vue'
import FeaturedTracks from '@/components/Analysis/FeaturedTracks.vue'
import PercentBar from '@/components/Analysis/PercentBar.vue'
import Spotlight from '@/components/Library/Spotlight.vue'
import Graph from '@/components/Analysis/Graph.vue'

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
    async checkTracksLoaded() {
      if (this.progress.tracksLoaded) {
        let response = await this.$store.dispatch('artistTracks', this.artistData);
        this.artistData.tracks = response;
        this.processTracks();
        response = await this.$store.dispatch('artistTimeline', this.artistData);
        this.artistData.timeline = response.timeline;
        this.artistData.oldest = response.oldest;
        this.artistData.newest = response.newest;
        clearInterval(this.interval);
        this.timelineReady = true;
        console.log(this.artistData);
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
    processTracks() {
      let averages = {valence: 0, danceability: 0, energy: 0};
      let keys = Object.keys(averages);
      for (let i = 0; i < keys.length; i++) {
        if (this.artistData.tracks.length == 0)
          break;
        for (let j = 0; j < this.artistData.tracks.length; j++) {
          averages[keys[i]] += this.artistData.tracks[j][keys[i]];
          this.audioFeaturesGraphs[keys[i]][Math.floor(this.artistData.tracks[j][keys[i]] * 10)] += 1;
        }
        this.artistData[keys[i]] = averages[keys[i]] / this.artistData.tracks.length;
      }
      this.audioFeaturesReady = true;
    },
    async getTopSongs() {
      this.artistData.topSongs = await this.$store.dispatch('artistTopTracks', this.$route.params.id);
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
        return this.artistData.topSongs.slice(0, 3);
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
      if (!this.progress.tracksLoaded)
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
    this.artistData = await this.$store.dispatch('artistAnalysis', this.$route.params.id);
    this.getTopSongs();
    if (this.progress.tracksLoaded) {
      let response = await this.$store.dispatch('artistTracks', this.artistData);
      this.artistData.tracks = response;
      this.processTracks();
      response = await this.$store.dispatch('artistTimeline', this.artistData);
      this.artistData.timeline = response.timeline;
      this.artistData.oldest = response.oldest;
      this.artistData.newest = response.newest;
      this.timelineReady = true;
      console.log(this.artistData);
    }
    else {
      this.interval = setInterval(this.checkTracksLoaded, 2000);
    }  
  }
}

</script>

<style scoped>

.displace {
  transform: translateY(-25px);
}


.featuredtracks {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
}
.library {
  background-image: url('../../assets/icons/library.svg');
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
.windows {
  align-items: top !important;
}

.window {
  margin: 25px 25px;
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

  .window {
      margin: 18px 18px !important;
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