<template>
  <div class="about maindiv">
    <NavBar path="h" />
    <div id="main">
      <div id="about-div">
        <h1>About My Music Taste</h1>
        <h2>Sharing Library Analysis</h2>
        <h3>Public vs. Link Only</h3>
        <p>Public Profiles will be available and listed on the social page.</p>
        <p>Link Only Profiles will be available to anyone on the internet, but only by those who know the link extension.</p>
        <h3>Data Shared</h3>
        <p>Sharing your library analysis will save the following data and create a link for others to view. Those who view your data will not have to login to Spotify</p>
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
  max-width: 700px;
  margin: 0 auto;
  margin-top: 64px;
  color: white;
  text-align: left;
  margin-bottom: 100px;
}

h1 {
  font-size: 3em;
  margin-bottom: 20px;
}
</style>