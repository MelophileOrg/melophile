<template>
  <div id="main-flex" class="genreanalysis">
    <NavBar/>    
    <div id="main">
      <GoBackSearch/>
      <div class="windows">

        <div class="window" :style="{'--delay': 0}">
          <div v-if="genreData != null" class="flex">
            <div class="flex">
              <div class="col">
                <div id="genre-image"/>
              </div>
              <div class="col fit">
                <h1 id="artist-name">{{genreData.name}}</h1>
                <h2>{{trackNum}} Tracks</h2>
                <h2>{{artistNum}} Artists</h2>
              </div>
            </div>
          </div>
          <Loading v-else/>
        </div>

        <div class="window" :style="{'--delay': + 1}">
          <h3  class="window-title" v-if="genreData != null">Liked Track's Characteristics:</h3>
          <div v-if="dataReady">
            <div v-if="!none">
              <PercentBar title="Happiness" :percent="averages.valence" :color="audioFeatures.valence.color" />
              <PercentBar title="Energy" :percent="averages.energy" :color="audioFeatures.energy.color" />
              <PercentBar title="Danceability" :percent="averages.danceability" :color="audioFeatures.danceability.color" />
            </div>
          </div>
          <h4 v-if="none">No Songs Liked</h4>
          <Loading class="displace" v-if="!dataReady"/>
        </div>

        <Spotlight v-if="!none" :delay="2" :override="dataReady" title="Top Saved Artists:" :list="topSavedArtistsObjects" :image="topSavedArtistsObjects[0].image"/>

        <Timeline :none="none" :small="true" :override="dataReady" title="When You Liked Tracks:" instructions="" :max="-1" :delay="2" :bars="timelineBars" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>

        <Graph :zero="none" :override="dataReady" title="Liked Tracks Happiness:" :delay="7" :bars="cleanGraphDataForwards(audioFeatureGraphs.valence)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph :zero="none" :override="dataReady" title="Liked Tracks Energy:" :delay="8" :bars="cleanGraphDataForwards(audioFeatureGraphs.energy)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph :zero="none" :override="dataReady" title="Liked Tracks Danceability:" :delay="9" :bars="cleanGraphDataForwards(audioFeatureGraphs.danceability)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>
        
        <Graph :zero="none" :override="dataReady" title="Add To Your Party Mixtape?" :delay="9" :bars="cleanGraphDataForwards(audioFeatureGraphs.banger)" max_tag="Absolute Bangers" min_tag="*Snore Snore*" y_axis="Number of Songs" :color="audioFeatures.banger.color"/>

        <FeaturedTracks :style="{'--delay': + 10}" class="featuredtracks" :saved="true" :none="none" :override="dataReady" title="First Liked Tracks:" :ids="oldestTracks"/>

        <FeaturedTracks :style="{'--delay': + 11}" class="featuredtracks" :saved="true" :none="none" :override="dataReady" title="Recently Liked Tracks:" :ids="newestTracks"/>

      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import GoBackSearch from '@/components/Lists/GoBackSearch.vue'
import Timeline from '@/components/Windows/Timeline.vue'
import PercentBar from '@/components/Analysis/PercentBar.vue'
import Graph from '@/components/Windows/Graph.vue'
import FeaturedTracks from '@/components/Windows/FeaturedTracks.vue'
import Spotlight from '@/components/Windows/Spotlight.vue'

export default {
  name: 'genreanalysis',
  components: {
      NavBar,
      GoBackSearch,
      Timeline,
      PercentBar,
      Graph,
      FeaturedTracks,
      Spotlight
  },
  data() {
      return {
        genreData: null,
        interval: null,
        dataReady: false,
        timeline: [],
        audioFeatureGraphs: {
          valence: [0,0,0,0,0,0,0,0,0,0],
          danceability: [0,0,0,0,0,0,0,0,0,0],
          energy: [0,0,0,0,0,0,0,0,0,0],
          banger: [0,0,0,0,0,0,0,0,0,0],
        },
        averages: {
          valence: 0,
          danceability: 0, 
          energy: 0,
          banger: 0,
        },
        topSavedArtists: [],
        recentlyLiked: [],
        firstLiked: [],
      }
  },
  methods: {
    checkForData() {
      if (this.progress.tracks) {
        clearInterval(this.interval);
        this.getData();
      }
    },
    cleanGraphDataForwards(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    getData() {
      if (this.$route.params.id in this.genres) {
        this.genreData = this.genres[this.$route.params.id];
        this.processData();
      }
      else
        this.genreData = {name: this.$route.params.id, tracknum: 0, artists: []};
    },
    processData() {
      let now = new Date();
      let nowTime = now.getTime();
      const MONTH = 2626560000;
      let keys = Object.keys(this.audioFeatureGraphs);
      for (let i = 0; i < this.genreData.artists.length; i++) {
        let addedTop = false;
        for (let j = 0; j < this.topSavedArtists.length; j++) {
          if (this.artists[this.genreData.artists[i]].tracks.length > this.artists[this.topSavedArtists[j]].tracks.length) {
            addedTop = true;
            this.topSavedArtists.splice(j, 0, this.genreData.artists[i]);
            break;
          }
        }
        if (this.topSavedArtists.length < 4 && !addedTop)
          this.topSavedArtists.push(this.genreData.artists[i]);
        if (this.topSavedArtists.length > 4)
          this.topSavedArtists = this.topSavedArtists.slice(0, 4);
        for (let j = 0; j < this.artists[this.genreData.artists[i]].tracks.length; j++) {
          let date = new Date(this.tracks[this.artists[this.genreData.artists[i]].tracks[j]].date);
          let dateTime = date.getTime();

          let diff = nowTime - dateTime;
          let diffMonth = Math.floor(diff / MONTH);

          let addedRecent = false;
          let addedOld = false;
          for (let k = 0; k < this.recentlyLiked.length; k++) {
            let recentDate = new Date(this.tracks[this.recentlyLiked[k].id].date);
            let recentDateTime = recentDate.getTime();

            let oldDate = new Date(this.tracks[this.firstLiked[k].id].date);
            let oldDateTime = oldDate.getTime();

            if (dateTime > recentDateTime && !addedRecent) {
              addedRecent = true;
              this.recentlyLiked.splice(j, 0, {id: this.artists[this.genreData.artists[i]].tracks[j], month: diffMonth});
            }
            if (dateTime < oldDateTime && !addedOld) {
              addedOld = true;
              this.firstLiked.splice(j, 0, {id: this.artists[this.genreData.artists[i]].tracks[j], month: diffMonth});
            }
          }
          if (this.recentlyLiked.length < 3 && !addedRecent)
            this.recentlyLiked.push({id: this.artists[this.genreData.artists[i]].tracks[j], month: diffMonth});
          if (this.recentlyLiked.length > 3)
            this.recentlyLiked = this.recentlyLiked.slice(0, 3);
          
          if (this.firstLiked.length < 3 && !addedRecent)
            this.firstLiked.push({id: this.artists[this.genreData.artists[i]].tracks[j], month: diffMonth});
          if (this.firstLiked.length > 3)
            this.firstLiked = this.firstLiked.slice(0, 3);


          if (diffMonth >= this.timeline.length) {
            while (diffMonth >= this.timeline.length) {
              this.timeline.push(0);
            }
          }
          this.timeline[diffMonth] += 1;
          for (let k = 0; k < keys.length; k++) {
            this.audioFeatureGraphs[keys[k]][Math.floor(this.tracks[this.artists[this.genreData.artists[i]].tracks[j]][keys[k]] * 10)] += 1;
            this.averages[keys[k]] += this.tracks[this.artists[this.genreData.artists[i]].tracks[j]][keys[k]];
          }
        }
        while (this.timeline.length < this.dateAdded.length) {
            this.timeline.push(0);
        }
      }

      for (let i = 0; i < keys.length; i++) {
        this.averages[keys[i]] /= this.genreData.tracknum;
      }
      this.dataReady = true;
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
  },
  computed: {
    topSavedArtistsObjects() {
      if (!this.dataReady)
        return;
      let ids = this.topSavedArtists;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        list.push(this.$store.state.artists[ids[i]]);
        list[i].value = list[i].tracks.length;
      }
      return list;
    },
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    },
    genres() {
      return this.$store.state.genres;
    },
    tracks() {
      return this.$store.state.tracks;
    },
    artists() {
      return this.$store.state.artists;
    },
    trackNum() {
      if (this.genreData != null) {
        if (this.genreData.tracknum > 0) {
          return this.genreData.tracknum;
        }
        return "No Songs Liked";
      }
      return "Loading...";
    },
    artistNum() {
      if (this.genreData != null) {
        if (this.genreData.artists.length > 0) {
          return this.genreData.artists.length;
        }
        return "No Artists";
      }
      return "Loading...";
    },
    dateAdded() {
      return this.$store.state.dateAdded;
    },
    timelineBars() {
      return this.cleanGraphData(this.timeline);
    },
    none() {
      if (this.genreData != null) {
        if (this.genreData.tracknum == 0)
          return true;
      }
      return false;
    },
    audioFeatures() {
      return this.$store.state.audioFeatures;
    },
    oldestTracks() {
      if (!this.dataReady)
        return [];
      return this.firstLiked;
    },
    newestTracks() {
      if (!this.dataReady)
        return [];
      return this.reverse(this.recentlyLiked);
    },
  },  
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    if (!this.inicialized)
      this.$router.push("/login");
    this.getData();
    if (!this.progress.tracks)
      this.interval = setInterval(this.checkForData, 1000);
  }
}

</script>

<style scoped>
#genre-image {
  display: block;
  width: 100px;
  height: 100px;
  background-size: auto 100%;
  background-position: center center;
  background-image: url('../../assets/icons/genres.svg');
  margin-right: 20px;
}

@media screen and (max-width: 720px) {

  #track-image {
    width: 70px !important;
    height: 70px !important;
    margin-right: 20px;
  }

  #genre-image {
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

.displace {
  transform: translateY(-25px);
}

h1 {
  font-size: 1.7em;
  text-transform: capitalize;
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

</style>