<template>
  <div class="boring maindiv">
    <NavBar path="boring" />
    <div id="main">
        <AppTitle v-if="!start" title="Boring-Radar" image="boring" font="Acme"/>
        <button>Start</button>

        <div id="details">
            <h1>Is Your Music Boring?</h1>
            <p>Inspired by a fantastic article written by Juan De Dios Santos, who uses Spotify's API to try to deduce whether his friend's claims that his music is "boring" are true.</p>
            <a href="https://towardsdatascience.com/is-my-spotify-music-boring-an-analysis-involving-music-data-and-machine-learning-47550ae931de">Is my Spotify music boring? An analysis involving music, data, and machine learning</a>
            <p>Santos uses the API simular to what is seen in the Library Analysis app to retrieve saved songs from both of their libraries, and request what Spotify calls "audio features" for each track. These features are listed below with Spotify's description of each.</p>
            <dl>
                <dt>Instrumentalness</dt>
                <dd>Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”.</dd>
                <dt>Acousticness</dt>
                <dd>A confidence measure from 0.0 to 1.0 of whether the track is acoustic.</dd>
                <dt>Liveness</dt>
                <dd>Detects the presence of an audience in the recording.</dd>
                <dt>Speechiness</dt>
                <dd>Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.</dd>
                <dt>Energy</dt>
                <dd>Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.</dd>
                <dt>Danceability</dt>
                <dd>Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.</dd>
                <dt>Valence</dt>
                <dd>A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track.</dd>
            </dl>
            <p>Santos uses a few different methods with this information to determine the "boringness" of their respective libraries, of which two are available here.</p>
            <h2>Music Variety</h2>
            <p>Variety is measured in standard deviation, and can either be taken from your variety of "audio features" or genres.</p>
            <h2>The Boring Equation</h2>
            <p>This website offers Santos' equation for boringness:</p>
            <p class="equation">boringness = loudness + tempo + (energy*100) + (danceability * 100)</p>
            <p>The equation was aimed after music that would be entertaining for a high energy party, as displayed by the variables used.</p>
            <p>I'm convinced standard deviation is a better claim to the boringness of tracks, because anything gets boring without variety.</p>
            <p>Regardless I hope you enjoy and hope your music taste holds well against the test!</p>
        </div>

      
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AppTitle from '@/components/AppTitle.vue'

export default {
  name: 'boring',
  components: {
    NavBar,
    AppTitle
  },
  data() {
      return {
          start: false,
      }
  },
  methods: {
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created: function() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>
#title {
    margin-left: 64px;
}

.main-div {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

button {
  padding: 10px 50px;
  margin-top: 20px;
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

h1 {
  font-size: 36px;
  line-height: 93px;
  letter-spacing: -.005em;
  cursor: default;
  color: rgba(223, 223, 223, 0.342);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.123);
  padding-left: 32px;

  text-align: left;
  margin: 0 auto;
  margin-top: 20px;
  width: calc(100% - (64px * 2));
}

#main {
  overflow-y: scroll;
}
</style>
