<template>
  <div id="main-flex" class="savelibrary">
    <NavBar/>
    <div id="main">
      
      <div id="done" v-if="!saved.attempted">
        <h1 class="small">Share Library</h1>
        <div class="flex flex-center flex-wrap settings small"> 
            <input type="text" v-model="name" placeholder="Display Name"/>
            <div id="privacy">
              <button class="privacybutton" @click="changePrivacy(false)" :class="{active: !privacy}">Public</button>
              <button class="privacybutton" @click="changePrivacy(true)" :class="{active: privacy}">Link Only</button>
            </div>
            <button id="continue" @click="save">Save Library</button>

            <p @click="toggleInformation" class="information-button" v-if="!information">More Information</p>
        </div>

        <div class="flex flex-center flex-wrap settings large">
            <h1>Share Library</h1>
            <input type="text" v-model="name" placeholder="Display Name"/>
            <div id="privacy">
              <button class="privacybutton" @click="changePrivacy(false)" :class="{active: !privacy}">Public</button>
              <button class="privacybutton" @click="changePrivacy(true)" :class="{active: privacy}">Link Only</button>
            </div>
            <button id="continue" @click="save">Save Library</button>
            <p @click="toggleInformation" v-if="!information" class="information-button">More Information</p>
        </div>
        
        <div id="save-details" v-if="information">
          <h4 class="top">Information on Saving Your Library</h4>
          <p>Save and share your library analysis with friends with a unique generated link!</p>
          <h4>Edit Your Profile</h4>
          <p>Pick and choose what information is displayed!</p>
          <p>Scroll down and turn off all items you don't want displayed.</p>
          <h4>Public Profiles</h4>
          <p>Listed and viewable by all who visit the site.</p>
          <h4>Link Only Profiles</h4>
          <p>Public but not listed. Link Only profiles can only be accessed by those who have your link.</p>
          <h4>Can I Change it Later?</h4>
          <p>Any future saves will overwrite your last profile, including privacy changes</p>
          <p></p>
          <p @click="toggleInformation" class="information-button">Close</p>
        </div>
      </div>

      <div id="done" v-if="saved.attempted">
        <div class="flex flex-center flex-wrap settings saved"> 
          <h1 v-if="saved.success && !saved.updated">Your Profile was Saved Successfully!</h1>
          <h1 v-if="saved.success && saved.updated">Your Profile was Updated Successfully!</h1>
          <h1 v-if="!saved.success">Whoops! Failed to Save Your Profile.</h1>
        </div>
        <p @click="myprofile" v-if="saved.success" id="link">{{link}}</p>
      </div>

      <h1 id="margin">Edit Profile</h1>
      <div v-if="progress.tracksLoaded" id="menu">
        <div id="tabs">
          <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
          <h2 @click="changeTab(1)" :class="{active: tab == 1}">Charts</h2>
          <h2 @click="changeTab(2)" :class="{active: tab == 2}">Extremes</h2>
        </div>
      </div>

      <div v-if="progress.tracksLoaded && tab == 0" class="windows">
        
        <YourLibrary :title="name + '\'s Library'" :class="{fade: !settings.numerical_data}" :state="settings.numerical_data" :save="true" :delay="0"  @toggleSave="toggleSave('numerical_data')"/>

        <Characteristics :class="{fade: !settings.audio_features}" :state="settings.audio_features" :save="true" @toggleSave="toggleSave('audio_features')" class="relative" :delay="0"/>

        <Spotlight :class="{fade: !settings.most_saved_artists}" :state="settings.most_saved_artists" :save="true" @toggleSave="toggleSave('most_saved_artists')" class="relative" :delay="0" :override="progress.artistsLoaded" title="Most Saved Artists:" :list="topSavedArtists" :image="topSavedArtists[0].image"/>

        <Spotlight :class="{fade: !settings.most_saved_genres}" :state="settings.most_saved_genres" :save="true" @toggleSave="toggleSave('most_saved_genres')" class="relative" :delay="0" :override="progress.genresLoaded" title="Most Saved Genres:" :list="topSavedGenres.slice(0, 4)" image=""/>

        <Averages :class="{fade: !settings.numerical_features}" :state="settings.numerical_features" :save="true" @toggleSave="toggleSave('numerical_features')" class="relative" :delay="0"/>

        <Chances :class="{fade: !settings.probability_features}" :state="settings.probability_features" :save="true" @toggleSave="toggleSave('probability_features')" class="relative" :delay="0"/>

        <Timeline :class="{fade: !settings.added_timeline}" :state="settings.added_timeline" :save="true" @toggleSave="toggleSave('added_timeline')" class="relative" :override="progress.tracksLoaded" title="When You Added Songs:" instructions="" :max="-1" :delay="0" :bars="cleanGraphData(dateAdded)" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        
        <TimelinePercent :class="{fade: !settings.happiness_timeline}" :state="settings.happiness_timeline" :save="true" @toggleSave="toggleSave('happiness_timeline')" class="relative" :override="progress.tracksLoaded" title="Happiness Over Time:" instructions="" :delay="0" :bars="cleanValuedGraphData(audioFeatures.valence.timeline)" :max="100" y_axis="Percent Happiness" />

        <Graph :class="{fade: !settings.happiness_distribution}" :state="settings.happiness_distribution" :save="true" @toggleSave="toggleSave('happiness_distribution')" class="relative" @more="goToExtremes" :override="progress.tracksLoaded" title="Happiness Distribution:" instructions="View Charts" :delay="0" :bars="cleanGraphData(audioFeatures.valence.plot)" max_tag="Happy" min_tag="Sad" y_axis="Number of Songs" :color="audioFeatures.valence.color"/>

        <Graph :class="{fade: !settings.energy_distribution}" :state="settings.energy_distribution" :save="true" @toggleSave="toggleSave('energy_distribution')" class="relative" @more="goToExtremes" :override="progress.tracksLoaded" title="Energy Distribution:" instructions="View Charts" :delay="0" :bars="cleanGraphData(audioFeatures.energy.plot)" max_tag="Hyper" min_tag="Peaceful" y_axis="Number of Songs" :color="audioFeatures.energy.color"/>

        <Graph :class="{fade: !settings.danceability_distribution}" :state="settings.danceability_distribution" :save="true" @toggleSave="toggleSave('danceability_distribution')" class="relative" @more="goToExtremes" :override="progress.tracksLoaded" title="Danceability Distribution:" instructions="View Charts" :delay="0" :bars="cleanGraphData(audioFeatures.danceability.plot)" max_tag="Let's dance!" min_tag="Couch Potato" y_axis="Number of Songs" :color="audioFeatures.danceability.color"/>

        <Graph :class="{fade: !settings.banger_distribution}" :state="settings.banger_distribution" :save="true" @toggleSave="toggleSave('banger_distribution')" class="relative" @more="goToExtremes" :override="progress.tracksLoaded" title="Should You DJ a Party?" instructions="View Charts" :delay="0" :bars="cleanGraphData(audioFeatures.banger.plot)" max_tag="Absolute Bangers" min_tag="*Snore Snore*" y_axis="Number of Songs" :color="audioFeatures.banger.color"/>
      </div>

      <div class="topcharts" v-if="progress.tracksLoaded && tab ==1">
        <div v-if="progress.genresLoaded" id="menu2">
          <div id="tabs">
            <h2 @click="changeChartTab(0)" :class="{active: charttab == 0}">Top Played</h2>
            <h2 @click="changeChartTab(1)" :class="{active: charttab == 1}">Top Saved</h2>
          </div>
        </div>
        <div v-if="charttab == 0 && progress.genresLoaded" class="charts-div">
          <TopPlayed :save="true" :statetracks="settings.most_played_tracks" :stateartists="settings.most_played_artists" @toggleSave="toggleSaveSpecial"/>
        </div>
        <div v-if="charttab == 1 && progress.genresLoaded" class="charts-div">
          <TopSaved :save="true" :stateartists="settings.most_saved_artists" :stategenres="settings.most_saved_genres" @toggleSave="toggleSaveSpecial"/>
        </div>
      </div> 

      <div class="extremes" v-if="progress.tracksLoaded && tab == 2">
        <Extremes :class="{fade: !settings.extremes}" :state="settings.extremes" :save="true" @toggleSave="toggleSave('extremes')"/>
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
  name: 'savelibrary',
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
      tab: 0,
      saved: {attempted: false, sucess: false, updated: false},
      name: "",
      privacy: false,
      information: false,
      settings: {
        numerical_data: true,
        most_saved_artists: true,
        audio_features: true,
        most_saved_genres: true,
        numerical_features: true,
        probability_features: true,
        added_timeline: true,
        happiness_distribution: true,
        energy_distribution: true,
        danceability_distribution: true,
        banger_distribution: true,
        most_played_tracks: true,
        most_played_artists: true,
        happiness_timeline: true,
        extremes: true,
        message: "",
      },
      data: null,
      charttab: 0,
    }
  },
  methods: {
    changePrivacy(val) {
      this.privacy = val;
    },
    toggleInformation() {
      this.information = !this.information;
    },
    toggleSave(key) {
      this.settings[key] = !this.settings[key];
    },
    toggleSaveSpecial(key) {
      this.settings[key] = !this.settings[key];
    },
    cleanGraphData(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: bars[i], tag: bars[i]});
      }
      return graphData;
    },
    cleanValuedGraphData(bars) {
      let graphData = [];
      for (let i = 0; i < bars.length; i++) {
        graphData.push({value: Math.round(bars[i].value * 100), tag: Math.round(bars[i].value * 100) + "%"});
      }
      return graphData;
    },
    changeTab(number) {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });
      this.tab = number;
    },
    myprofile() {
      this.$router.push('/social/myprofile');
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
    async save() {
      try {
        this.message = "";
        this.data = await this.$store.dispatch('saveLibrary', {name: this.name, private: this.privacy, include: this.settings});
        if (this.data == null) {
          this.message = "Public Profiles require Numerical Data, Characteristics, Most Played Tracks and Artists.";
        }
        let id = this.$store.state.user.id;
        let profileResult = await axios.post('/api/profile/' + id, {privacy: this.privacy, name: this.name, include: this.settings, 
          tracks: Object.keys(this.$store.state.tracks).length, artists: Object.keys(this.$store.state.artists).length, genres: Object.keys(this.$store.state.genres).length
        });
        let trackResult = await axios.post('/api/tracks/' + id, {tracks: this.data.tracks});
        let artistResult = await axios.post('/api/artists/' + id, {artists: this.data.artists});
        let genreResult = await axios.post('/api/genres/' + id, {genres: this.data.genres});
        let collectionResult = await axios.post('/api/collections/' + id, 
        {
          topPlayed: this.data.topPlayed,
          topSaved: this.data.topSaved,
          audioFeatures: this.data.audioFeatures,
          dateAdded: this.data.dateAdded,
          happinessTimeline: this.data.happinessTimeline,
          mode: this.data.mode,
        });
        this.saved.attempted = true;
        this.saved.success = profileResult.data.success && trackResult.data.success && artistResult.data.success && genreResult.data.success && collectionResult.data.success;
        this.saved.updated = profileResult.data.updated && trackResult.data.updated && artistResult.data.updated && genreResult.data.updated && collectionResult.data.updated;
      } catch (error) {
        this.message = error;
      }

      

    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    total() {
      return this.$store.state.progress.total;
    },
    progress() {
      return this.$store.state.progress;
    },
    artists() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.artists;
    },
    genres() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.genres;
    },
    audioFeatures() {
      if (!this.progress.tracksLoaded)
        return;
      return this.$store.state.audioFeatures;
    },
    dateAdded() {
      if (!this.progress.tracksLoaded)
        return;
      let normal = this.$store.state.dateAdded;
      let reversed = [];
      for (var i = normal.length - 1; i >= 0; i--) {
        reversed.push(normal[i]);
      }
      return reversed;
    },
    topSavedArtists() {
      if (!this.progress.artistsLoaded)
        return;
      let ids = this.$store.state.topSaved.artists;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        list.push(this.$store.state.artists[ids[i]]);
        list[i].value = list[i].tracks.length;
      }
      return list;
    },
    topSavedGenres() {
      if (!this.progress.genresLoaded)
        return;
      let ids = this.$store.state.topSaved.genres;
      let list = [];
      for (let i = 0; i < ids.length && i < 4; i++) {
        let genre = this.$store.state.genres[ids[i]];
        genre.value = genre.tracknum;
        list.push(genre);
      }
      return list;
    },
    link() {
      return "mymusictaste.org/social/profile/" + this.$store.state.user.id;
    }
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>

<style scoped>

.toggle {
  font-size: 20px;
  background-color: rgba(59, 59, 59, 0.048);
  color: rgba(255, 255, 255, 0.123);
  font-weight: bolder;
  width: 45px;
  padding: 5px;
  border-radius: 10px;
  border: 0;
  transition: all .3s ease;
}

.form {
  display: block;
  margin: 0 auto;
    margin-top: 20px;
}

input {
  font-size: 20px;
  border-radius: 0px;
  background: rgba(255, 255, 255, 0.103);
  border: 0;
  padding: 10px;

  width: calc(100% - 20px);
  max-width: 400px;
  color: white;
}

#privacy {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  margin-top: 30px;
}

.privacybutton {
  background-color: rgba(146, 146, 146, 0.13);
  border: 0px;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 10px;
  color: rgba(255, 255, 255, 0.137);
  width: 45%;
  border-radius: 0px;
  border: 1px solid rgba(255, 255, 255, 0);
  transition: all .3s ease;
}

.privacybutton.active {
  background-color: rgba(184, 184, 184, 0.164);
  color: rgba(255, 255, 255, 0.89);
}

#margin {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 25px;
  padding-bottom: 15px;
}

.toggle.active {
  color: white;
  background-color: rgba(128, 128, 128, 0.048);
  
}

.toggletitle {
  font-size: 20px;
  width: 240px;
  margin: 10px 0;
}

.windows {
  margin-bottom: 100px !important;
}

.fade {
  animation: fade-out .3s ease;
  opacity: .3;
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: .3;
  }
}
.progress {
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgb(238, 126, 137);
  background-image: radial-gradient(circle at center center, rgb(137, 126, 238), rgb(238, 126, 137));
  background-size: 100% 300%;
  background-position: center -300%;
  animation: background-move 10s linear infinite;
}

@keyframes background-move {
  0% {
    background-position: center -300%;
  }
  100% {
    background-position: center 0%;
  }
}

.progress-info {
  padding-top: 12vh;
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

#done h1 {
  animation: none;
}

.small {
  display: none !important;
}

.settings {
  display: block;
  background-color: rgba(255, 255, 255, 0);
  width: calc(80vw - 260px);
  max-width: 420px;
  margin: 0 auto;
  padding: 20px;
}

.settings h1 {
  margin-left: 0px;
}
@media screen and (max-width: 720px) {
  h1 {
    text-align: center !important;
    margin-left: 0px !important;
  }

  .settings {
  width: calc(80vw) !important;
  }

  .small {
    display: block !important;
  }

  .large {
    display: none;
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

  #done {
    width: 100vw !important;
  }

  
  #save-details {
    width: calc(90vw - 60px) !important;
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
  margin: 30px 30px !important;
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

#done {
  display: block;
  width: calc(100vw - 260px);
  padding: 30px 0px;
  padding-top: 22px;
  background: rgba(248, 248, 248, 0.103);
  animation: slide-up .3s ease;
}

#continue {
  padding: 10px 0;
  width: 100%;
  font-size: 20px;
  background-color: rgba(81, 177, 255, 0.993);
  border-radius: 0px;
  color: white;
  height: 50px;
  font-weight: bolder;
  border: 1px solid rgba(255, 255, 255, 0.055);
  margin-top: 30px;
  margin-bottom: 10px;
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

#save-details {
  margin: 0 auto;
  margin-top: 20px;
  width: calc(90vw - 60px - 260px);
  max-width: calc(1000px - 60px);
  background: rgba(255, 255, 255, 0.055);
  padding: 30px;
  margin-bottom: 20px;
  animation: slide-up .5s ease-out;
}

#save-details p {
  margin: 0;
  color: rgba(255, 255, 255, 0.575);
  line-height: 25px;
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif;
  text-align: left;
}

.information-button {
    font-family: 'Roboto', sans-serif;
    color: rgba(255, 255, 255, 0.404);
    transition: all .3s ease;
    display: inline-block;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 10px !important;
    cursor: pointer;
}
.information-button:hover {
  color: white;
}

#save-details h4 {
  margin: 0;
  color: rgb(255, 255, 255);
  line-height: 25px;
  margin-bottom: 3px;
  margin-top: 20px;
  text-align: left;
}

#save-details h4.top {
  margin-top: 0px;
  font-size: 25px;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.settings.saved h1 {
  margin-bottom: 0px;
}

#linkdesc {
  display: none;
  color: rgba(255, 255, 255, 0.425);
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  text-align: left;
  font-weight: bolder;
  margin-bottom: 0;
}

#link {
  display: inline-block;
  max-width: calc(85vw - 30px);
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 15px;
  font-family: 'Roboto', sans-serif;
  color: white;
  word-break: break-all;
  line-height: 20px;
  background-color: rgba(255, 255, 255, 0.096);
  padding: 15px;
  cursor: pointer;
}

</style>