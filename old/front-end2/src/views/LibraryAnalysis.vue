<template>
  <div class="libraryanalysis maindiv">
    <NavBar path="libraryanalysis" />
    <div id="main">
      <AppTitle v-if="!done" title="Library Analysis" image="library"/>
      <button v-if="!done && progress == 0" @click="startRetrievalProcess">Start</button>
      <div v-if="!done && progress != 0" id="progress-bar">
        <div :style="{'--total': + total, '--progress': + progress}" id="progress-fill"/>
      </div>
      <h3 v-if="!done && progress != 0">{{message}}</h3>
      <div v-if="done" id="results">
        
        <div id="menu">
          <h1>Your Library Analysis</h1>
          <div id="tabs">
            <h2 @click="changeTab(0)" :class="{active: tab == 0}">Big Picture</h2>
            <h2 @click="changeTab(1)" :class="{active: tab == 1}">Extremes</h2>
          </div>
        </div>

        <div id="audio-features" v-if="tab == 0">
          <div v-if="tab == 0" id="library-details" class="window" :style="{'--delay': + 0}">
            <h3>Your Library</h3>
            <div class="row">
              <h4 class="light"><h4>{{total}}</h4>Saved Songs</h4>
            </div>
            <div class="row">
              <h4 class="light"><h4>{{Object.keys(artists).length}}</h4>Artists</h4>
            </div>
            <div v-if="genresDone" class="row">
              <h4 class="light"><h4>{{Object.keys(genres).length}}</h4>Genres</h4>
            </div>
          </div>

          <div id="artist-details" class="window" :style="{'--delay': + 1}">
            <h3 v-if="!artistsDone">Artists</h3>
            <div class="loading" v-if="!artistsDone">
              <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
            </div>
            <h3 v-if="artistsDone" class="nomargin">Most Saved From:</h3>
            <div v-if="artistsDone" class="row favorite-div">
              <img :src="favoriteArtists[0].image"/>
              <div>
                <h4 class="favorite">{{favoriteArtists[0].name}}</h4>
                <h5>{{favoriteArtists[0].num}} Songs</h5>
              </div>
            </div>
            <div v-if="artistsDone">
              <div class="row center">
                <div class="artist" v-for="i in (favoriteArtists.length - 1)" :key="favoriteArtists[i].id" >
                  <h4>{{favoriteArtists[i].name}}</h4>
                  <h5>{{favoriteArtists[i].num}} Songs</h5>
                </div>
              </div>
            </div>
          </div>

          <div id="characteristics" class="window" :style="{'--delay': 2}">
            <h3>Characteristics</h3>
            <div class="row stat">
              <h4 class="bar-title">Happiness</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.valence.value, '--red': + barColors[0].red, '--green': + barColors[0].green, '--blue': + barColors[0].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.valence.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">Energy</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.energy.value, '--red': + barColors[1].red, '--green': + barColors[1].green, '--blue': + barColors[1].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.energy.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">Danceability</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.danceability.value, '--red': + barColors[2].red, '--green': + barColors[2].green, '--blue': + barColors[2].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.danceability.value)}}</h4>
            </div>
          </div>

          <div id="genre-details" class="window" :style="{'--delay': + 3}">
            <h3 v-if="!genresDone">Genres</h3>
            <div class="loading" v-if="!genresDone">
              <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
            </div>
            <div v-if="genresDone">
              <h3 class="nomargin">Favorite Genres</h3>
              <div class="row favorite-div">
                <div>
                  <h4 class="favorite">{{favoriteGenres[0].genre}}</h4>
                  <h5>{{favoriteGenres[0].num}} Songs</h5>
                </div>
              </div>
              <div class="row center">
                <div class="genre" v-for="i in (favoriteGenres.length - 1)" :key="favoriteGenres[i].genre" >
                  <h4>{{favoriteGenres[i].genre}}</h4>
                  <h5>{{favoriteGenres[i].num}} Songs</h5>
                </div>
              </div>
            </div>
          </div>

          <div id="averages" class="window" :style="{'--delay': 4}">
            <h3>Averages</h3>
            <div class="row stat">
              <h4 class="bar-title">Tempo</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + tempoPercent, '--red': + barColors[3].red, '--green': + barColors[3].green, '--blue': + barColors[3].blue}"/>
              </div>
              <h4 class="value">{{tempoAverage}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">Major Key</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.mode.value, '--red': + barColors[4].red, '--green': + barColors[4].green, '--blue': + barColors[4].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.mode.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">Minor Key</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + 1 - (audio_features.mode.value), '--red': + barColors[9].red, '--green': + barColors[9].green, '--blue': + barColors[9].blue}"/>
              </div>
              <h4 class="value">{{percent(1 - audio_features.mode.value)}}</h4>
            </div>
          </div>

          <div id="chances" class="window"  :style="{'--delay': 5}">
            <h3>Chance a Song in Your Library...</h3>
            <div class="row stat">
              <h4 class="bar-title">is Accoustic</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.acousticness.value, '--red': + barColors[5].red, '--green': + barColors[5].green, '--blue': + barColors[5].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.acousticness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">is Instrumental</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.instrumentalness.value, '--red': + barColors[6].red, '--green': + barColors[6].green, '--blue': + barColors[6].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.instrumentalness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">is Live</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.liveness.value, '--red': + barColors[7].red, '--green': + barColors[7].green, '--blue': + barColors[7].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.liveness.value)}}</h4>
            </div>
            <div class="row stat">
              <h4 class="bar-title">is Talking</h4>
              <div class="stat-bar">
                <div class="fill" :style="{'--percent': + audio_features.speechiness.value, '--red': + barColors[8].red, '--green': + barColors[8].green, '--blue': + barColors[8].blue}"/>
              </div>
              <h4 class="value">{{percent(audio_features.speechiness.value)}}</h4>
            </div>
          </div>

          <div id="time-graph" class="window" :style="{'--delay': 6}">
            <h3>When You Added Songs</h3>
            <div class="graph" :style="{'--max': + findMax(dates), '--red': + barColors[4].red, '--green': + barColors[4].green, '--blue': + barColors[4].blue}">
              <div class="graph-bar time" v-for="(date, index) in dates.slice().reverse()" :key="'date' + index" :class="{toolow: date < findMax(dates) / 10}" :style="{'--num': dates.length,'--height': + date}"><p>{{date}}</p><p class="hover-graph">{{findDate(dates.length - index)}}</p></div>
              <p class="yAxis">Number of Songs</p>
            </div>
            <div class="graph-labels">
              <p>{{findDate(dates.length - 1)}}</p>
              <p>{{findDate(0)}}</p>
            </div>
          </div>

          <div id="happiness-graph" class="window" :style="{'--delay': 7}">
            <h3>Happiness Distribution</h3>
            <div class="graph" :style="{'--max': + findMax(audio_features.valence.plot), '--red': + barColors[0].red, '--green': + barColors[0].green, '--blue': + barColors[0].blue}">
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[0] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[0]}"><p>{{audio_features.valence.plot[0]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[1] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[1]}"><p>{{audio_features.valence.plot[1]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[2] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[2]}"><p>{{audio_features.valence.plot[2]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[3] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[3]}"><p>{{audio_features.valence.plot[3]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[4] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[4]}"><p>{{audio_features.valence.plot[4]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[5] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[5]}"><p>{{audio_features.valence.plot[5]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[6] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[6]}"><p>{{audio_features.valence.plot[6]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[7] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[7]}"><p>{{audio_features.valence.plot[7]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[8] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[8]}"><p>{{audio_features.valence.plot[8]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.valence.plot[9] < findMax(audio_features.valence.plot) / 10}" :style="{'--height': + audio_features.valence.plot[9]}"><p>{{audio_features.valence.plot[9]}}</p></div>
              <p class="yAxis">Number of Songs</p>
            </div>
            <div class="graph-labels">
              <p>Sad</p>
              <p>Happy</p>
              <p class="instructions">Go to the Extremes Tab for the Highest and Lowest Tracks</p>
            </div>
          </div>

          <div id="happiness-graph" class="window" :style="{'--delay': 8}">
            <h3>Energy Distribution</h3>
            <div class="graph" :style="{'--max': + findMax(audio_features.energy.plot), '--red': + barColors[1].red, '--green': + barColors[1].green, '--blue': + barColors[1].blue}">
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[0] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[0]}"><p>{{audio_features.energy.plot[0]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[1] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[1]}"><p>{{audio_features.energy.plot[1]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[2] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[2]}"><p>{{audio_features.energy.plot[2]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[3] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[3]}"><p>{{audio_features.energy.plot[3]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[4] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[4]}"><p>{{audio_features.energy.plot[4]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[5] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[5]}"><p>{{audio_features.energy.plot[5]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[6] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[6]}"><p>{{audio_features.energy.plot[6]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[7] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[7]}"><p>{{audio_features.energy.plot[7]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[8] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[8]}"><p>{{audio_features.energy.plot[8]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.energy.plot[9] < findMax(audio_features.energy.plot) / 10}" :style="{'--height': + audio_features.energy.plot[9]}"><p>{{audio_features.energy.plot[9]}}</p></div>
              <p class="yAxis">Number of Songs</p>
            </div>
            <div class="graph-labels">
              <p>Peaceful</p>
              <p>Hyper</p>
              <p class="instructions">Go to the Extremes Tab for the Highest and Lowest Tracks</p>
            </div>
          </div>

          <div id="happiness-graph" class="window" :style="{'--delay': 9}">
            <h3>Danceability Distribution</h3>
            <div class="graph" :style="{'--max': + findMax(audio_features.danceability.plot), '--red': + barColors[2].red, '--green': + barColors[2].green, '--blue': + barColors[2].blue}">
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[0] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[0]}"><p>{{audio_features.danceability.plot[0]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[1] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[1]}"><p>{{audio_features.danceability.plot[1]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[2] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[2]}"><p>{{audio_features.danceability.plot[2]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[3] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[3]}"><p>{{audio_features.danceability.plot[3]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[4] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[4]}"><p>{{audio_features.danceability.plot[4]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[5] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[5]}"><p>{{audio_features.danceability.plot[5]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[6] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[6]}"><p>{{audio_features.danceability.plot[6]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[7] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[7]}"><p>{{audio_features.danceability.plot[7]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[8] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[8]}"><p>{{audio_features.danceability.plot[8]}}</p></div>
              <div class="graph-bar" :class="{toolow: audio_features.danceability.plot[9] < findMax(audio_features.danceability.plot) / 10}" :style="{'--height': + audio_features.danceability.plot[9]}"><p>{{audio_features.danceability.plot[9]}}</p></div>
              <p class="yAxis">Number of Songs</p>
            </div>
            <div class="graph-labels">
              <p>Couch Potato</p>
              <p>Let's Dance!</p>
              <p class="instructions">Go to the Extremes Tab for the Highest and Lowest Tracks</p>
            </div>
          </div>

          <div id="banger-graph" class="window" :style="{'--delay': 10}">
            <h3>Should You DJ a Party</h3>
            <div class="graph" :style="{'--max': + findMax(bangers.plot), '--red': + barColors[3].red, '--green': + barColors[2].green, '--blue': + barColors[2].blue}">
              <div class="graph-bar" :class="{toolow: bangers.plot[0] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[0]}"><p>{{bangers.plot[0]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[1] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[1]}"><p>{{bangers.plot[1]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[2] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[2]}"><p>{{bangers.plot[2]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[3] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[3]}"><p>{{bangers.plot[3]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[4] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[4]}"><p>{{bangers.plot[4]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[5] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[5]}"><p>{{bangers.plot[5]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[6] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[6]}"><p>{{bangers.plot[6]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[7] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[7]}"><p>{{bangers.plot[7]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[8] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[8]}"><p>{{bangers.plot[8]}}</p></div>
              <div class="graph-bar" :class="{toolow: bangers.plot[9] < findMax(bangers.plot) / 10}" :style="{'--height': + bangers.plot[9]}"><p>{{bangers.plot[9]}}</p></div>
              <p class="yAxis">Number of Songs</p>
            </div>
            <div class="graph-labels">
              <p>*Snore*</p>
              <p>Absolute Bangers</p>
              <p class="instructions">Go to the Extremes Tab for the Highest and Lowest Tracks</p>
            </div>
          </div>

          <div class="window" id="form" :style="{'--delay': 11}">
            <h3 v-if="!saved">Share Your Library</h3>
            <p  v-if="!saved">Privacy</p><button  v-if="!saved" :class="{active: privacyVal}" id="privacy" @click="privacy(true)">Link Only</button><button v-if="!saved" :class="{active: !privacyVal}" id="privacy" @click="privacy(false)">Public</button>
            <input id="urname" v-if="!saved" v-model="displayName" type="text" placeholder="Display Name"/>
            <p id="moreinfo" @click="route('about')">More Info</p>
            <button v-if="!saved" id="save" @click="save">Save</button>
            <h2 v-if="saved" id="id-title">Your Link</h2>
            <a id="link" v-if="saved" :href="'http://mymusic.andrewdanielyoung.com/view/' + userid">{{'http://mymusic.andrewdanielyoung.com/view/' + userid}}</a>
          </div>

        </div>

        <div id="extremes" v-if="tab == 1">
          <div id="extremes-menu">
            <h6>List the </h6>
            <Select class="marginleft" @pending="pending('filter')" @selection="filter" :load="true" :options="filters"/>
            <Select class="marginleft" @pending="pending('catagory')" @selection="catagory" :load="true" :options="sorts"/>
          </div>
          <table class="table" id="tracks" v-if="list.length != 0">
            <tr class="track" v-for="(track, index) in list" :key="track.id" :style="{'--delay': + index}">
              <a class="row">
              <td>
                <h2>{{index + 1}}</h2>
              </td>
              <td>
                <div class="image" :style="{backgroundImage: 'url(\'' + track.album.images[0].url + '\')'}"/>
              </td>
              <td class="title">
                <h1>{{track.name}}</h1>
                <div class="track-artists">
                  <div class="track-artist-div" v-for="index in 4" :key="track.name + '-' + (index - 1)">
                    <a  class="track-artist" v-if="(index - 1) < track.artists.length">{{track.artists[(index - 1)].name}}<h4 class="comma" v-if="(index - 1) < track.artists.length - 1">, </h4></a>
                  </div>  
                </div>
              </td>
              </a>
            </tr>
          </table>
          <table class="table" v-if="list.length == 0">
            <tr class="loadingspace" v-for="num in 10" :key="'loading-spaces'+num" :style="{'--delay': + num}">
              <a class="row fake"/>
            </tr>
          </table>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AppTitle from '@/components/AppTitle.vue'
import Select from '@/components/Select.vue'

export default {
  name: 'libraryanalysis',
  components: {
    NavBar,
    AppTitle,
    Select,
  },
  data() {
    return {
      displayName: "",
      privacyVal: true,
      sorts: [
        {value: 'valence', text: "Happy"},
        {value: 'energy', text: "Energetic"},
        {value: 'danceability', text: "Dancable"},
        {value: 'tempo', text: "High Tempos"},
        {value: 'bangers', text: "Bangers"},
        {value: 'acousticness', text: "Accoustic"},
        {value: 'instrumentalness', text: "Instrumental"},
        {value: 'liveness', text: "Live"},
        {value: 'speechiness', text: "Talking"},
      ],
      filters: [
        {value: 1, text: "Most"},
        {value: 0, text: "Least"}
      ],
      barColors: [
        {red: 242, green: 142, blue: 43},
        {red: 89, green: 161, blue: 79},
        {red: 78, green: 121, blue: 167},
        {red: 225, green: 87, blue: 89},
        {red: 74, green: 189, blue: 180},
        {red: 237, green: 201, blue: 72},
        {red: 255, green: 157, blue: 167},
        {red: 176, green: 122, blue: 161},
        {red: 156, green: 117, blue: 95},
        {red: 180, green: 189, blue: 74},
      ],
      tab: 0,
      list: [],

      animateIndex: 0,
      interval: null,

      catagoryVal: "",
      filterVal: -1,
      saved: false,
    }
  },
  methods: {
    privacy(bool) {
      this.privacyVal = bool;
    },
    async save() {
      await this.$store.dispatch('saveLibrary', {name: this.displayName, privacy: this.privacyVal});
      this.saved = true;
    },
    findDate(months) {
      let month = 2626560000;
      let n = new Date();
      let t = n.getTime();
      t -= (month * months);
      let then = new Date(t);
      let returnMonth = then.getMonth();
      if (returnMonth == 0)
        returnMonth = 12;
      let returnYear = then.getFullYear() % 100;
      return returnMonth + "/" + returnYear;
    },
    findMax(array) {
      let max = 0;
      for (var i = 0; i < array.length; i++)
      {
        if (array[i] > max)
          max = array[i];
      }
      return max;
    },
    pending(type) {
      if (type == 'filter')
        this.filterVal = -1;
      else 
        this.catagoryVal = "";
      this.list = [];
    },
    catagory(val) {
      this.catagoryVal = val;
      this.checkList();
    },
    filter(val) {
      this.filterVal = val;
      this.checkList();
    },
    async checkList() {
      let chart = [];
      if (this.catagoryVal != "" && this.filterVal != -1)
      {
        if (this.catagoryVal == "bangers")
        {
          if (this.filterVal == 0)
            chart = this.bangers.minchart;
          else 
            chart = this.bangers.maxchart;
        }
        else {
          if (this.filterVal == 0)
            chart = this.audio_features[this.catagoryVal].minchart;
          else 
            chart = this.audio_features[this.catagoryVal].maxchart;
        }
      }
      if (chart.length > 0)
      {
        let ids=[];
        for (let i = 0; i < chart.length; i++)
        {
          ids.push(chart[i].id);
        }
        let response = await this.$store.dispatch('getTracks', ids);
        for (let i = 0; i < response.tracks.length; i++)
        {
          response.tracks[i][this.catagoryVal] = chart[i].value;
        }
        this.list = response.tracks;
      }
    },
    percent(value) {
      return Math.round(value * 100) + "%";
    },
    changeTab(val) {
      this.tab = val;
    },
    async startRetrievalProcess() {
      await this.$store.dispatch('runLibraryAnalysis');
    },
    animate() {
      if (this.animateIndex >= 1)
      {
        this.animateIndex = 1;
        clearInterval(this.interval);
      }
      else
        this.animateIndex += .1;
    },
    route(path) {
      this.$router.push("/" + path);
    },
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    tempoPercent() {
      if (this.done)
      {
        let min = this.audio_features.tempo.minchart[0].value;
        let max = this.audio_features.tempo.maxchart[0].value;
        let diff = max - min;
        return (this.audio_features.tempo.value - min) / diff;
      }
      return 0;
    },
    tempoAverage() {
      return Math.round(this.audio_features.tempo.value);
    },
    libraryData() {
      return this.$store.state.libraryData;
    },
    progress() {
      return this.$store.state.progress.num;
    },
    total() {
      return this.$store.state.progress.total;
    },
    message() {
      return this.$store.state.progress.message;
    },
    done() {
      return this.$store.state.libraryData.complete.done;
    },
    audioFeaturesDone() {
      return this.$store.state.libraryData.complete.audioFeaturesDone;
    },
    artistsDone() {
      return this.$store.state.libraryData.complete.artistsDone;
    },
    genresDone() {
      return this.$store.state.libraryData.complete.genresDone;
    },
    artists() {
      return this.$store.state.libraryData.artists;
    },
    genres() {
      return this.$store.state.libraryData.genres;
    },
    audio_features() {
      return this.$store.state.libraryData.audio_features;
    },
    bangers() {
      return this.$store.state.libraryData.bangers;
    },
    dates() {
      return this.$store.state.libraryData.dates;
    },
    favoriteArtists() {
      return this.$store.state.libraryData.favoriteArtists;
    },
    favoriteGenres() {
      return this.$store.state.libraryData.favoriteGenres;
    },
    tracks() {
      return this.$store.state.libraryData.tracks;
    },
    userid() {
      return this.$store.state.user.id;
    }
  },
  async created() {
    if (!this.inicialized)
      this.$router.push("/login");
    this.interval = setInterval(this.animate, 100);
  }
}
</script>

<style scoped>
.graph-bar.time {
  --num: 0;
  width: calc((100% / var(--num)) - 4px) !important;
  margin: 0px 0px;
  position: relative;
}

.graph-bar.time p {
  display: none;
}

#form input {
  width: calc(100% - 20px);
  border: 0;
  padding: 10px;
  margin-top: 25px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.082);
  color: white;
  font-size: 1.1em;
  max-width: 280px;
}

#form a {
  display: block;
  width: 300px;
  margin: 0 auto;
  text-decoration: none;
  color: white;

  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  font-size: 2em;
  animation: slide-up .3s ease .2s, peekaboo .2s linear;
}

#form p {
  display: block;
  margin: 10 0px;
  margin-bottom: 8px;
  font-size: 1.5em;
  color: white;
  font-weight: bolder;
}

#form #privacy {
  margin: 0px 10px;
  padding: 10px;
  width: 130px;
  font-size: 1.1em;
  display: inline-block;
  transition: all .3s ease;
  margin-bottom: 3px;
}

#form #save:hover {
  background: rgb(13, 153, 13);
}

#form .active#privacy {
  background-color:rgba(250, 246, 246, 0.404);
}

#form #privacy:hover {
  background-color:rgba(250, 246, 246, 0.404);
}

#form #save {
  display: block;
  margin: 0 auto;
  margin-top: 15px;
  background: green;
  transition: all .3s ease;
}

.graph-bar.time:hover p {
  position: absolute;
  text-align: center;
  display: block;
  top: -50px;
  width: 50px;
  margin: 0;
  padding: 3px;
  height: 14px;
  z-index: 100;
  color: white;
  background: rgba(0, 0, 0, 0.842);
  transform: translateY(-0px) translateX(-25px);
}



#moreinfo {
  font-size: 1em !important;
  color:rgba(250, 246, 246, 0.404);
  margin: 0 0;
  margin-top: 10px;
  cursor: pointer;
}

.graph-bar.time:hover p.hover-graph {
  transform: translateY(20px) translateX(-25px);
}

.graph {
  --max: 0;
  --red: 0;
  --green: 0;
  --blue: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  position: relative;
  max-width: 400px;
  width: 100%;
  height: 200px;
  background: rgba(226, 226, 226, 0.041);
  border-radius: 5px;
  padding-top: 10px;
}

.graph-labels {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  width: 400px;
}

.instructions {
  display: block;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: -23px;
  color: rgba(255, 255, 255, 0.082) !important;
}

.graph-labels p {
  margin: 5px 0;
  margin-top: 15px;
  font-size: .8em;
 
  color: rgba(250, 246, 246, 0.404);
  
  transform: translateY(-5px);
}



.yAxis {
  position: absolute;
  transform: rotate(-90deg);
  color: rgba(250, 246, 246, 0.404);
  font-size: .8em;
  left: -58px;
  top: 80px;

}

p {
  display: inline-block;
}

.graph-bar.toolow p {
  transform: translateY(-25px);
}

.graph-bar {
  --height: 0;
  display: block;
  width: calc(10% - 2px - 10px);
  margin: 0px 5px;
  height: calc((var(--height) / var(--max)) * 100% - 5px);
  padding-top: 5px;
  background: rgba(var(--red), var(--green), var(--blue), .9);
  border: 1px solid rgba(255, 255, 255, 0.151);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  animation: bar-graph-slide .5s ease-out .8s, peekaboo .8s;
}

.graph-bar p{
  color: rgba(255, 255, 255, 0.692);
  font-weight: bolder;
  margin: 0;
  font-size: .5em;
  transform: translateX(-1px);
}

@media screen and (min-width: 535px) {
  .graph-bar p {
    transform: translateX(-0px);
    font-size: .8em;
  }
}

@keyframes bar-graph-slide {
  from {
    height: calc((var(--height) / var(--max)) * 0% - 5px);
    color: rgba(255, 255, 255, 0);
  }
}

a.row {
  text-decoration: none;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 15px;
  width: calc(100%);
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 0px auto;
  border-radius: 0px;
  margin-bottom: 3px;
  max-width: 800px;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  border: 1px solid rgba(199, 199, 199, 0.034);
}

#extremes-menu {
  max-width: 100vw;
}

#extremes {
  max-width: 100vw;
}

@media screen and (min-width: 720px) {
  #extremes-menu {
    max-width: calc(100vw - 260px) !important;
  }
  #extremes {
    max-width: calc(100vw - 260px) !important;
  }
}

.track {
  display: block;
  width: calc(100%);
  border: 0;
}


a.row h1 {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
  animation: none;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

td.title{
  display: block;
  width: calc(100% - 100px);
}


a.row h2 {
  color: rgb(250, 250, 250);
  margin: 0 10px 0px 0px;
  font-weight: bolder;
  font-size: 20px;
  width: 20px;
  animation: none;
}

.image {
  display: block;
  width: 60px;
  height: 60px;
  background-size: auto 100%;
  background-position: center center;
}

.table {
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  margin-bottom: 100px;
  margin-top: 40px;
}

tr {
  --delay: 0;
  overflow: hidden;
  position: relative;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s) linear;
  border: 1px solid rgba(255, 255, 255, 0.116);
}

.comma {
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 12px;
  margin: 0;
  margin-right: 7px;
}



.track-artists .track-artist {
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 15px;
  margin: 0;
}

.track-artists {
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

.load#extremes-menu {
  margin-top: 40px;
  transition: all .3s ease;
}

.marginleft {
  margin-left: 15px;
}

#extremes-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 5px auto;
  animation: slide-up .3s ease .3s, peekaboo .3s linear;
}

#extremes-menu h6 {
  color: rgba(252, 252, 252, 0.301);
  text-shadow: 1px 1px 10px rgba(255, 255, 255, 0.075);
  font-size: 40px;
  font-weight: lighter;
  margin: 0;
  font-family: 'Bitter', serif;
  font-family: 'Roboto', sans-serif;
}


#audio-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 75px;
  padding: 32px;
  padding-top: 0px;
}
#menu {
  padding: 10px 32px;
}

#tabs {
  display: flex;
  justify-content: center;
  width: 100%;
}

.loading {
  margin-top: 30px;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 20px 20px;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}

h1 {
  color: white;
  text-align: left;
  animation: slide-up .3s ease 0s, peekaboo 0s linear;
}

h2 {
  color: rgba(255, 255, 255, 0.452);
  margin: 10px 20px;
  cursor: pointer;
  transition: all .3s ease;
  animation: slide-up .3s ease .1s, peekaboo .1s linear;
}

.row {
  display: flex;
  align-items: center;
}

.bar-row {
  justify-content: space-between;
}

h2:hover {
  color: rgba(255, 255, 255, 0.87);
}

h2.active {
  color: white;
}




button {
  padding: 10px 50px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.137);
  border-radius: 5px;
  color: rgb(255, 255, 255);
  border: 0px;
  font-weight: bolder;
  font-size: 1.2em;
  animation: slide-up .3s ease .3s, peekaboo .3s linear;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

h3 {
  margin: 5px;
  margin-top: 10px;
  color: white;
  animation: throb 2s ease 0s infinite;
}

@keyframes throb {
  0% {
    color: white;
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
  50% {
    color: rgb(167, 167, 167);
    text-shadow: 0px 0px 0px rgba(255, 255, 255, 0.482);
  }
  100% {
     text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
}
#progress-bar {
  display: block;
  width: 40%;
  height: 8px;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(250, 250, 250, 0.173);
  margin: 0 auto;
  margin-top: 20px;
}

#progress-fill {
  --total: 0;
  --progress: 0;
  display: block;
  background: rgb(244, 244, 244);
  width: calc(var(--progress) / var(--total) * 100%);
  height: 100%;
}

img {
  display: block;
  width: 70px;
  height: 70px;
  margin-right: 20px;
}

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

.bar-title {
  width: 115px;
}

.stat-bar {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    max-width: 200px;
    width: calc(100% - 155px);
    max-height: 10px;
    background-color: rgba(255, 255, 255, 0.247);
}

.stat-bar .fill {
    --percent: 0;
    --red: 255;
    --green: 255;
    --blue: 255;
    display: block;
    width: calc(var(--percent) * 100%);
    height: 10px;
    background: rgb(var(--red), var(--green), var(--blue));
    animation: slow-fill 1s ease;
}

@keyframes slow-fill {
  from {
    width: calc(var(--percent) * 0%);
  }
}

.window h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
}

.stat {
  margin-bottom: 15px;
  justify-content: space-between;
}

.value {
  width: 40px;
  text-align: right;
}

.nomargin {
  margin-bottom: 0 !important;
}

.favorite {
  font-size: 1.8em;
  text-transform: capitalize;
}

.favorite-div
{
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 10px;
  background: rgba(255, 255, 255, 0.062);
}

.favorite-div h5 {
  font-size: 1em;
  margin-top: 5px;
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
.light h4 {
  margin-right: 5px;
  font-size: 1.6em;
}
.center {
  justify-content: space-around;
  flex-wrap: wrap;
}

.artist {
  margin-top: 10px;
  display: block;
  width: 110px;
  padding: 0px 10px;
}

.artist h4 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

.genre {
  margin-top: 10px;
  display: block;
  width: 110px;
  padding: 0px 10px;
}

.genre h4 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  text-transform: capitalize;
}


</style>