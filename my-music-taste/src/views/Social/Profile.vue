<template>
  <div id="main-flex" class="profile">
    <NavBar/>
    <div id="main">

      <h1 v-if="dataRetrieved" id="margin">{{name}}'s Library</h1>

      <div v-if="dataRetrieved" id="menu">
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
          <h2 @click="changeTab(1)" v-if="(include.most_played_tracks ||include.most_played_artists ||include.most_saved_artists ||include.most_saved_genres)" :class="{active: tab == 1}">Charts</h2>
          <h2 @click="changeTab(2)" v-if="include.extremes" :class="{active: tab == 2}">Extremes</h2>
        </div>
      </div>
      <div v-if="dataRetrieved && tab == 0" class="windows">

        <YourLibrary v-if="include.numerical_data" :title="name + '\'s Library'" :profile="true" :data="numbers" :delay="0"/>

        <Characteristics v-if="include.audio_features"  :profile="true" :data="audioFeatures" :delay="1"/>

        <Spotlight v-if="include.most_saved_artists" :profile="true" :delay="2" :override="dataRetrieved" title="Most Saved Artists:" :list="topSavedArtists" :image="topSavedArtists[0].image"/>

        <Spotlight v-if="include.most_saved_genres" :profile="true" :delay="3" :override="dataRetrieved" title="Most Saved Genres:" :list="topSavedGenres.slice(0, 4)" image=""/>

        <Averages v-if="include.numerical_features"  :profile="true" :data="{audioFeatures: audioFeatures, mode: mode}" :delay="4"/>

        <Chances v-if="include.probability_features"  :profile="true" :data="audioFeatures" :delay="5"/>

        <Timeline v-if="include.added_timeline"  :title="'When ' + name + ' Added Songs:'" :override="dataRetrieved" instructions="" :max="-1" :delay="6" :bars="cleanGraphData(dateAddedComputed)" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        
        <TimelinePercent v-if="include.happiness_timeline"  :override="dataRetrieved" title="Happiness Over Time:" instructions="" :delay="7" :bars="cleanValuedGraphData(happinessTimeline)" :max="100" y_axis="Percent Happiness" />

        <Graph v-if="include.happiness_distribution"  @more="goToExtremes" :override="dataRetrieved" title="Happiness Distribution:" instructions="View Charts" :delay="8" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>

        <Graph v-if="include.energy_distribution"  @more="goToExtremes" :override="dataRetrieved" title="Energy Distribution:" instructions="View Charts" :delay="9" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="{red: 89, green: 161, blue: 79}"/>

        <Graph v-if="include.danceability_distribution"  @more="goToExtremes" :override="dataRetrieved" title="Danceability Distribution:" instructions="View Charts" :delay="10" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="{red: 78, green: 121, blue: 167}"/>

        <Graph v-if="include.banger_distribution"  @more="goToExtremes" :override="dataRetrieved" :title="'Should ' + name + ' Throw a Party?'" instructions="View Charts" :delay="11" :bars="cleanGraphData(audioFeatures.banger.plot)" max_tag="Absolute Bangers" min_tag="*Snore Snore*" y_axis="Number of Songs" :color="{red: 225, green: 87, blue: 89}"/>
      </div>

      
      <div class="topcharts" v-if="dataRetrieved && tab == 1 && (include.most_played_tracks ||include.most_played_artists ||include.most_saved_artists ||include.most_saved_genres)">
        <div v-if="dataRetrieved" id="menu2">
          <div id="tabs">
            <h2 @click="changeChartTab(0)" v-if="(include.most_played_tracks ||include.most_played_artists)" :class="{active: charttab == 0}">Top Played</h2>
            <h2 @click="changeChartTab(1)" v-if="(include.most_saved_artists ||include.most_saved_genres)" :class="{active: charttab == 1}">Top Saved</h2>
          </div>
        </div>
        <div v-if="(charttab == 0 && dataRetrieved) || (!include.most_saved_artists && !include.most_saved_genres)" class="charts-div">
          <TopPlayed :data="{name: name, topPlayed: topPlayed, tracks: tracks, artists: artists, artistsAllowed: include.most_played_artists, tracksAllowed: include.most_played_tracks}" :profile="true"/>
        </div>
        <div v-if="(charttab == 1 && dataRetrieved) || (!include.most_played_tracks && !include.most_played_artists)" class="charts-div">
          <TopSaved :data="{name: name, topSaved: topSaved, genres: genres, artists: artists, artistsAllowed: include.most_saved_artists, genresAllowed: include.most_saved_genres}" :profile="true"/>
        </div>
      </div> 

      <div class="extremes" v-if="dataRetrieved && tab == 2 && include.extremes">
        <Extremes :profile="true" :data="{audioFeatures: audioFeatures, tracks: tracks}"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Graph from '@/components/Analysis/Graph.vue'
import Timeline from '@/components/Analysis/Timeline.vue'
import TimelinePercent from '@/components/Analysis/TimelinePercent.vue'
import Spotlight from '@/components/Library/Spotlight.vue'
import YourLibrary from '@/components/Library/YourLibrary.vue'
import Characteristics from '@/components/Library/Characteristics.vue'
import Averages from '@/components/Library/Averages.vue'
import Chances from '@/components/Library/Chances.vue'
import Extremes from '@/components/Library/Extremes.vue'
import TopSaved from '@/components/Library/TopSaved.vue'
import TopPlayed from '@/components/Library/TopPlayed.vue'

import axios from 'axios';

export default {
  name: 'profile',
  components: {
    NavBar,
    Graph,
    Timeline,
    Spotlight,
    YourLibrary,
    Characteristics,
    Averages,
    Chances,
    Extremes,
    TimelinePercent,
    TopSaved,
    TopPlayed
  },
  data() {
    return {
      dataRetrieved: false,
      charttab: 0,
      tab: 0,
      name: "",
      numbers: {
        tracks: 0,
        artists: 0,
        genres: 0,
      },
      tracks: null,
      artists: null,
      genres: null,
      audioFeatures: null,
      mode: null,
      dateAdded: null,
      happinessTimeline: null,
      topSaved: null,
      topPlayed: null,
      include: null,
    }
  },
  methods: {
    async retrieveData() {
      let profile = await axios.get('/api/profile/' + this.$route.params.id);
      let tracks = await axios.get('/api/tracks/' + this.$route.params.id);
      let artists = await axios.get('/api/artists/' + this.$route.params.id);
      let genres = await axios.get('/api/genres/' + this.$route.params.id);
      let collections = await axios.get('/api/collections/' + this.$route.params.id);
      this.name = profile.data.name;
      this.include = profile.data.include;
      this.created = profile.data.created;
      this.numbers.tracks = profile.data.tracks;
      this.numbers.artists = profile.data.artists.num;
      this.numbers.genres = profile.data.genres;
      this.tracks = tracks.data.tracks;
      this.artists = artists.data.artists;
      this.genres = genres.data.genres;
      this.audioFeatures = collections.data.audioFeatures;
      if ('acousticness' in this.audioFeatures)
        this.audioFeatures.acousticness.color = {red: 237, green: 201, blue: 72};
      if ('danceability' in this.audioFeatures)
        this.audioFeatures.danceability.color = {red: 78, green: 121, blue: 167};
      if ('energy' in this.audioFeatures)
        this.audioFeatures.energy.color = {red: 89, green: 161, blue: 79};
      if ('instrumentalness' in this.audioFeatures)
        this.audioFeatures.instrumentalness.color = {red: 176, green: 122, blue: 161};
      if ('liveness' in this.audioFeatures)
        this.audioFeatures.liveness.color = {red: 237, green: 201, blue: 72};
      if ('loudness' in this.audioFeatures)
        this.audioFeatures.loudness.color = {red: 242, green: 142, blue: 43};
      if ('speechiness' in this.audioFeatures)
        this.audioFeatures.speechiness.color = {red: 242, green: 142, blue: 43};
      if ('valence' in this.audioFeatures)
        this.audioFeatures.valence.color = {red: 242, green: 142, blue: 43};
      if ('tempo' in this.audioFeatures)
        this.audioFeatures.tempo.color = {red: 225, green: 87, blue: 89};
      this.mode = collections.data.mode;
      this.mode.major =  {red: 74, green: 189, blue: 180};
      this.mode.minor= {red: 180, green: 189, blue: 74};
      this.dateAdded = collections.data.dateAdded;
      this.happinessTimeline = collections.data.happinessTimeline;
      this.topSaved = collections.data.topSaved;
      this.topPlayed = collections.data.topPlayed;
      this.dataRetrieved = true;
    },
    changeTab(number) {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.tab = number;
    },
    changeChartTab(number) {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.charttab = number;
    },
    goToExtremes() {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.tab = 2;
    },
    cleanGraphData(bars) {
      if (!this.dataRetrieved)
        return;
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    cleanValuedGraphData(bars) {
      if (!this.dataRetrieved)
        return;
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: Math.round(bars[i].value * 100), tag: Math.round(bars[i].value * 100) + "%"});
      }
      return graphData;
    },
  },
  computed: {
    dateAddedComputed() {
      if (!this.dataRetrieved)
        return;
      let normal = this.dateAdded;
      let reversed = [];
      for (var i = normal.length - 1; i >= 0; i--) {
        reversed.push(normal[i]);
      }
      return reversed;
    },
    topSavedArtists() {
      if (!this.dataRetrieved)
        return;
      let ids = this.topSaved.artists;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        list.push(this.artists[ids[i]]);
        list[i].value = list[i].tracks.length;
      }
      return list;
    },
    topSavedGenres() {
      if (!this.dataRetrieved)
        return;
      let ids = this.topSaved.genres;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        let genre = this.genres[ids[i]];
        genre.value = genre.tracknum;
        list.push(genre);
      }
      return list;
    },
  },
  created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    this.retrieveData();
  }
}
</script>


<style scoped>
#margin {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 25px;
  padding-bottom: 15px;
}

.windows {
  margin-bottom: 100px !important;
}


@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: .3;
  }
}

#menu {
  width: calc(100% - 64px);
  padding: 10px 32px;
  animation: slide-up .3s ease .1s, hide .1s linear;
}

#menu2 {
  width: calc(100% - 64px);
  padding: 10px 32px;
  padding-top: 0px;
  animation: slide-up .3s ease .1s, hide .1s linear;
}

.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

h1 {
    color: #fff;
    margin-left: 32px;
    margin-top: 0px;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
    position: relative;
}


@media screen and (max-width: 720px) {
  h1 {
    text-align: center !important;
    margin-left: 0px !important;
  }

  h2 {
    font-size: 1.2em;
  }

  #menu {
    padding: 10px 0;
    width: 100vw;
    margin-bottom: 10px;
    background-color: rgba(255, 251, 251, 0.048);
  }
}

#tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 100vw;
  flex-wrap: wrap;
}

h2 {
  color: rgba(255, 255, 255, 0.452);
  margin: 10px 20px;
  cursor: pointer;
  transition: all .3s ease;
  
}

h2.active {
  color: white;
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

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

h5 {
  color: rgba(255, 255, 255, 0.514);
  margin: 0;
  text-align: left;
  font-size: .8em;
}

.light {
  color: rgba(255, 255, 255, 0.514) !important;
  font-size: 1.4em;
  margin-bottom: 2px;
}

.extremes {
  margin-top: 20px;
}

.num {
  margin-right: 5px;
  font-size: 1.8em;
}

h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}

.windows {
  margin-top: 0px;
}


</style>