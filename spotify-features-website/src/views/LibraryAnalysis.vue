<template>
  <div class="libraryanalysis">
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

          <div id="chances" class="window"  :style="{'--delay': 6}">
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

          <div id="happiness-graph" class="window" :style="{'--delay': 5}">
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

          <div id="happiness-graph" class="window" :style="{'--delay': 7}">
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

          <div id="happiness-graph" class="window" :style="{'--delay': 5}">
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

          <div id="banger-graph" class="window" :style="{'--delay': 6}">
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
              <td>
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
      
      libraryData: {
        tracks: [],
        audio_features: null,
      },
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
      genres: {},
      favoriteGenres: [],

      artists: {},
      favoriteArtists: [],

      audio_features: {
        acousticness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        danceability: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        energy: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        instrumentalness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        liveness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        mode: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [-1],
        },
        speechiness: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        tempo: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [-1],
        },
        total: 0,
        valence: 
        {
          value: 0,
          maxchart: [],
          minchart: [],
          plot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        },
      },
      bangers: {
        value: 0,
        plot: [0,0,0,0,0,0,0,0,0,0],
        maxchart: [],
        minchart: [],
      },
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
      total: 0,
      progress: 0,

      done: false,
      audioFeaturesDone: false,
      artistsDone: false,
      genresDone: false,

      message: "Pluggin in headphones.",

      tab: 0,
      list: [],

      animateIndex: 0,
      interval: null,

      catagoryVal: "",
      filterVal: -1,
    }
  },
  methods: {
    banger(loudness, tempo, energy, danceability) {
      return (tempo + (energy * 100) + (danceability*100)) / 375;
    },
    findMax(array) {
      let max = 0;
      for (var i = 0; i < array.length; i++)
      {
        if (array[i] > max)
        {
          max = array[i];
        }
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
          {
            chart = this.bangers.minchart;
          }
          else {
            chart = this.bangers.maxchart;
          }
        }
        else {
          if (this.filterVal == 0)
          {
            chart = this.audio_features[this.catagoryVal].minchart;
          }
          else {
            chart = this.audio_features[this.catagoryVal].maxchart;
          }
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
    startRetrievalProcess() {
      this.retriveData(0, 50, true);
    },
    async retriveData(offset, limit) {
      if (this.$router.currentRoute.name != "libraryanalysis")
      {
        return;
      }
      let response = await this.$store.dispatch('getSavedTracks',{limit: limit, offset: offset});
      // get genre
      this.total = response.total;
      if (this.progress / this.total > .8)
        
        this.message = "♪┏(・o･)┛♪┗ ( ･o･) ┓♪";
      else if (this.progress / this.total > .6)
        this.message = "Sick beats dude.";
      else if (this.progress / this.total > .4)
        this.message = "Jamming out to your tunes.";
      else if (this.progress / this.total > .2)
        this.message = "Beep Bop. Analyzing Data.";
      let ids = [];
      for (var i = 0; i < response.items.length; i++)
      {
        ids.push(response.items[i].track.id);
        if (!(response.items[i].track.artists[0].name in this.artists))
        {
          this.artists[response.items[i].track.artists[0].name] = {num: 1, id: response.items[i].track.artists[0].id};
        }
        else {
          this.artists[response.items[i].track.artists[0].name].num += 1;
        }
      }
      let tracks = await this.$store.dispatch('getAudioFeaturesForTracks',ids);
      this.analyseData(tracks);
      if (response.items.length == 50)
      {
        this.retriveData(offset + limit, limit, false);
      }
      else {
        let keys = Object.keys(this.audio_features);
        for (var i = 0; i < keys.length; i++)
        {
          if (keys[i] == "total")
            continue;
          this.audio_features[keys[i]].value /= this.audio_features.total;
        }
        this.done = true;
        this.audioFeaturesDone = true;
        await this.checkArtists();
        this.checkGenres();
        this.libraryData.audio_features = this.audio_features;
        this.libraryData.audio_features.bangers = this.bangers;
        this.$store.dispatch('changeLibraryData', this.libraryData);
      }
    },
    analyseData(tracks) {
      this.libraryData.tracks = this.libraryData.tracks.concat(tracks);
      let keys = Object.keys(this.audio_features); 
      for (let i = 0; i < tracks.length; i++)
      {
        this.bangers.value += this.banger(tracks[i].loudness, tracks[i].tempo, tracks[i].energy, tracks[i].danceability);
        let bangersPos = (Math.floor(this.banger(tracks[i].loudness, tracks[i].tempo, tracks[i].energy, tracks[i].danceability) * 10));
        if (bangersPos < this.bangers.plot.length)
          this.bangers.plot[bangersPos] += 1;
        else
            this.bangers.plot[this.bangers.plot.length - 1] += 1;

        for (let j = 0; j < keys.length; j++)
        {
          if (keys[j] == "total")
          {
            this.audio_features.total += 1;
            continue;
          }
          this.audio_features[keys[j]].value += tracks[i][keys[j]];
          
          if (this.audio_features[keys[j]].plot[0] != -1)
            this.audio_features[keys[j]].plot[(Math.floor(tracks[i][keys[j]] * 10))] += 1;

          for (let k = 0; k < this.audio_features[keys[j]].minchart.length; k++)
          {
            if (this.audio_features[keys[j]].minchart[k].value > tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].minchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].minchart.length > 20)
              {
                this.audio_features[keys[j]].minchart.splice(20, 1);
              }
              break;
            }
            if (k == this.audio_features[keys[j]].minchart.length - 1 && this.audio_features[keys[j]].minchart.length < 20)
            {
              this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].minchart.length == 0)
          {
            this.audio_features[keys[j]].minchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
          }
          for (let k = 0; k < this.audio_features[keys[j]].maxchart.length; k++)
          {
            if (this.audio_features[keys[j]].maxchart[k].value < tracks[i][keys[j]])
            {
              this.audio_features[keys[j]].maxchart.splice(k, 0, {id: tracks[i].id, value: tracks[i][keys[j]]});
              if (this.audio_features[keys[j]].maxchart.length > 20)
              {
                this.audio_features[keys[j]].maxchart.splice(20, 1);
              }
              break;
            }
            if (k == this.audio_features[keys[j]].maxchart.length - 1 && this.audio_features[keys[j]].maxchart.length < 20)
            {
              this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
              break;
            }
          }
          if (this.audio_features[keys[j]].maxchart.length == 0)
          {
            this.audio_features[keys[j]].maxchart.push({id: tracks[i].id, value: tracks[i][keys[j]]});
          }
        }

        let bangindex = this.banger(tracks[i].loudness, tracks[i].tempo, tracks[i].energy, tracks[i].danceability);
        for (let k = 0; k < this.bangers.minchart.length; k++)
        {
          if (this.bangers.minchart[k].value > bangindex)
          {
            this.bangers.minchart.splice(k, 0, {id: tracks[i].id, value: bangindex});
            if (this.bangers.minchart.length > 20)
            {
              this.bangers.minchart.splice(20, 1);
            }
            break;
          }
          if (k == this.bangers.minchart.length - 1 && this.bangers.minchart.length < 20)
          {
            this.bangers.minchart.push({id: tracks[i].id, value: bangindex});
            break;
          }
        }
        if (this.bangers.minchart.length == 0)
        {
          this.bangers.minchart.push({id: tracks[i].id, value: bangindex});
        }
        for (let k = 0; k < this.bangers.maxchart.length; k++)
        {
          if (this.bangers.maxchart[k].value < bangindex)
          {
            this.bangers.maxchart.splice(k, 0, {id: tracks[i].id, value: bangindex});
            if (this.bangers.maxchart.length > 20)
            {
              this.bangers.maxchart.splice(20, 1);
            }
            break;
          }
          if (k == this.bangers.maxchart.length - 1 && this.bangers.maxchart.length < 20)
          {
            this.bangers.maxchart.push({id: tracks[i].id, value: bangindex});
            break;
          }
        }
        if (this.bangers.maxchart.length == 0)
        {
          this.bangers.maxchart.push({id: tracks[i].id, value: bangindex});
        }





        this.progress += 1;
      }
    },
    async checkArtists() {
      let max = 4;
      
      for (var artist in this.artists) {
        let added = false;
        for (var i = 0; i < this.favoriteArtists.length; i++)
        {
          if (this.favoriteArtists[i].num < this.artists[artist].num)
          {
            this.favoriteArtists.splice(i, 0, {name: artist, num: this.artists[artist].num, id: this.artists[artist].id});
            added = true;
            break;
          }
          if (this.favoriteArtists.length > max)
          {
            this.favoriteArtists.splice(this.favoriteArtists.length - 1, 1);
          }
        }
        if (this.favoriteArtists.length < max && !added) {
          this.favoriteArtists.push({name: artist, num: this.artists[artist].num, id: this.artists[artist].id});
        }
      }
      let favoriteArtist = await this.$store.dispatch('getArtist', this.favoriteArtists[0].id);
      this.favoriteArtists[0].image = favoriteArtist.images[0].url;
      this.artistsDone = true;
    },
    async checkGenres() {
      let max = 4;
      let querymax = 50;
      let artistsIds = [];
      for (var artist in this.artists) {
        if (querymax == 0)
        {
          let artistsData = await this.$store.dispatch('getArtists', artistsIds);
          for (var i = 0; i < artistsData.artists.length; i++)
          {
            for (var j = 0; j < artistsData.artists[i].genres.length; j++)
            {

              if (!(artistsData.artists[i].genres[j] in this.genres))
              {
                this.genres[artistsData.artists[i].genres[j]] = {num: this.artists[artist].num, genre: artistsData.artists[i].genres[j]};
              }
              else {
                this.genres[artistsData.artists[i].genres[j]].num += this.artists[artist].num;
              }
            }
          }
          querymax = 50;
          artistsIds = [];
        }
        if (artist in this.artists)
        {
          artistsIds.push(this.artists[artist].id);
          querymax -= 1;
        }
      }

      for (var genre in this.genres) {
        let added = false;
        for (var i = 0; i < this.favoriteGenres.length; i++)
        {
          if (this.favoriteGenres[i].num < this.genres[genre].num)
          {
            this.favoriteGenres.splice(i, 0, {genre: genre, num: this.genres[genre].num});
            added = true;
            break;
          }
          if (this.favoriteGenres.length > max)
          {
            this.favoriteGenres.splice(this.favoriteGenres.length - 1, 1);
          }
        }
        if (this.favoriteGenres.length < max && !added) {
          this.favoriteGenres.push({genre: genre, num: this.genres[genre].num});
        }
      }
      this.genresDone = true;

    },
    animate() {
      if (this.animateIndex >= 1)
      {
        this.animateIndex = 1;
        clearInterval(this.interval);
      }
      else {
        this.animateIndex += .1;
      }
    }
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
    }
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
    this.interval = setInterval(this.animate, 100);
  }
}
</script>

<style scoped>
.graph {
  --max: 0;
  --red: 0;
  --green: 0;
  --blue: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  position: relative;
  width: 400px;
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
  animation: bar-graph-slide .5s ease-out .7s, peekaboo .7s;
}

.graph-bar p{
  color: rgba(255, 255, 255, 0.692);
  font-weight: bolder;
  margin: 0;
  font-size: .8em;
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
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 0px 32px;
  border-radius: 0px;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
}


a.row h1 {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
  animation: none;
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


.libraryanalysis {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
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
  margin-top: 30px;
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
    width: 200px;
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