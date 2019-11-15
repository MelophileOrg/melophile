<template>
  <div class="about maindiv">
    <NavBar path="h" />
    <div id="main">
      <div id="about-div">
        <h1>About My Music Taste</h1>
        <h2>Spotify Authorization</h2>
        <p>Authorization through Spotify is done through Implicit Grant Flow, meaning the access token is not refreshable and lasts an hour before a new token is needed.</p>
        <p>All authorization is run through the user's browser and is not saved by My Music Mood. Data about your library is not saved unless explicitly done so within Library Analysis for sharing purposes.</p>
        <p>My Music Mood asks permission to the following scopes: </p>
        <ul>
          <li>Read the User's Recently Played (My Music Mood)</li>
          <li>Read the User's Top Tracks and Artists (My Charts)</li>
          <li>Read the User's Library (Library Analysis)</li>
          <li>Read the User's Data (Save Library - Usage Described Below)</li>
        </ul>

        <h2>Sharing Library Analysis</h2>
        <h3>Public vs. Link Only</h3>
        <p>Public Profiles will be available and listed on the social page.</p>
        <p>Link Only Profiles will be available to anyone on the internet, but only by those who know the link extension.</p>
        <p>The link to your page is http://mymusic.andrewdanielyoung.com/view/ followed by your Spotify ID.</p>
        <p>If you save your library at a future date, your old information will be updated, thus deleting your old information.</p>
        <p>Your ID is used in order to achieve this.</p>
        <h3>Data Shared</h3>
        <p>Sharing your library analysis will save the following data and create a link for others to view. Those who view your data will not have to login to Spotify.</p>
        <h4>Data Saved:</h4>
        <ul>
          <li>Chosen Display Name</li>
          <li>Top 20 Played Songs</li>
          <li>Top 20 Played Artists</li>
          <li>Total Saved Song</li>
          <li>Total Saved Artists</li>
          <li>Total Saved Genres</li>
          <li>Top Four Saved Artists</li>
          <li>Top Four Saved Genres</li>
          <li>Happiness, Energy and Danceability Values</li>
          <li>Tempo, Major/Minor Averages</li>
          <li>Chances of Accoustic, Instrumental, Live and Speaking Tracks</li>
          <li>Song Add Date Graph</li>
          <li>Happiness Distribution Graph</li>
          <li>Energy Distribution Graph</li>
          <li>Danceability Distribution Graph</li>
          <li>Banger Distribution Graph</li>
          <li>Top 10 and Least 10 of Extreme Catagories</li>
        </ul>

        <h2>Happiness, Energy, Danceability?</h2>
        <h3>Spotify provides all that information via their API!</h3>
        <p>A machine learning algorithm has run through their tracks and set values for the following fields:</p>
        <ul>
          <li>acousticness</li>
          <li>danceability</li>
          <li>energy</li>
          <li>instrumentalness</li>
          <li>liveness</li>
          <li>loudness</li>
          <li>speechiness</li>
          <li>valence (Happiness)</li>
          <li>tempo</li>
          <li>mode (Major/Minor)</li>
          <li>key</li>
        </ul>
        <p>Most of these values are decimals between 0-1.</p>
        <p>Library analysis asks for your saved songs 50 (the max) at a time. It then gathers song ID's and requests these audio features for each song.</p>
        <p>It then takes all the audio features values from each track and averages them out to give you your library's details.</p>
        <p>While it's sorting through, it stores the highest and lowest of each catagory.</p>
        <h2>What about Bangers?</h2>
        <p>The idea started from an article I read while doing some research.</p>
        <a href="https://towardsdatascience.com/is-my-spotify-music-boring-an-analysis-involving-music-data-and-machine-learning-47550ae931de">Is my Spotify music boring? An analysis involving music, data, and machine learning</a>
        <p>In this article by Juan De Dios Santos, he tries to figure out if his library is "boring", as so claims his friend.</p>
        <p>He goes through a few different methods, one of which I ended up using for the Boring-Radar: standard deviation.</p>
        <p>One of his methods was an equation he created, based on what he think would be good at a party:</p>
        <p class="equation">boringness  =  loudness + tempo + (energy  x  100) + (danceability  x  100)</p>
        <p>While writing an equation for "boringness" is amusing, I disagree with the idea that "boring" music is anything not great to head bang to at a party.</p>
        <p>I did decided to use this equation for my Banger-Level, but made adjustments.</p>
        <p>Loudness is a weird inconsistant value that in my opinion has no place in the equation, so I removed it.</p>
        <p>Tracks have gotten louder over time, which doesn't serve to prove that they're LOUD, just means you don't have to turn your speakers up as much.</p>
        <p>The average tempo of all music is around 116 BPM, which means an "average" tempo already has more weight than energy and danceability which max at 100.</p>
        <p>I thought it was stupid to weight tempo that much, so I equalized it. If tempo is higher than an average, it adds. If it's lower, it subtracks from the score.</p>
        <p>Finally I though energy was far more important than danceability.</p>
        <p>Conceptually danceability should be equal with energy, but I found it's value to be inconsistant and not as worth while as energy</p>
        <p>Here's my equation:</p>
        <p class="equation">bangerness  =  (tempo  -  96) + (energy  x  100) + (danceability  x  50)</p>
        <p>Very opinion based, but I found my personal results consistant. I find it easier to look at your "Top Bangers" to understand how the value works, than to look up songs you attribute to being "bangers".</p>
        <p>I needed the value to be between 0-1, so from trial and error I found that a consistant max for my "banger equation" was 210, giving my library of 4,300 songs a consistant bell curve.</p>
        <p>The final equation:</p>
        <p class="equation">bangerness  =  ((tempo  -  96) + (energy  x  100) + (danceability  x  50))  /  210</p>
        <p>Quantifiable Track Banger-Level</p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'about',
  components: {
    NavBar
  },
  methods: {

  }, 
  computed: {

  }
}

</script>
<style scoped>
#about-div {
  display: block;
  width: calc(100% - 64px);
  max-width: 900px;
  margin: 0 auto;
  margin-top: 64px;
  color: white;
  text-align: left;
  margin-bottom: 100px;
  background: rgba(255, 255, 255, 0.075);
  padding: 50px;
  border-radius: 10px;
}

h1 {
  font-size: 3em;
  margin-bottom: 20px;
  margin-top: 0px;
}

h2 {
  margin-top: 40px;
  font-size: 2em;
}

h3 {
  color: rgba(255, 255, 255, 0.356);
  font-size: 1.5em;
}

h4 {
  font-weight: lighter;
}

p {
  line-height: 25px;
  font-size: 1em;
  text-overflow:clip;
  white-space:pre-wrap;
}

li {
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.466);
}

a {
  color: rgb(173, 173, 173);
}

.equation {
  padding: 10px;
  background: rgba(255, 255, 255, 0.068);
}
</style>