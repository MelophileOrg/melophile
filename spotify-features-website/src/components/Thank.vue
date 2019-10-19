<template>
    <div class="Thank">
        <h2>Made Possible By</h2>
        <a href="https://developer.spotify.com/" id="big-title">
            <img src="../assets/icons/spotify.svg"/>
            <h1>Spotify Web API</h1>
        </a>
    </div>
</template>

<script>
export default {
  name: 'Thank',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Thank {
    display: block;
    width: 100%;
    background-image: radial-gradient(circle at 0px 0px, rgba(107, 111, 167, 0.5), rgba(59, 63, 125, .8));
    padding: 30px 0px;
    padding-bottom: 35px;
    margin-top: 00px;
    margin-top: 80px;
}
#big-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  display: block;
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
#big-title h1 {
  color: white;
  font-size: 50px;
  margin: 0px;
}

h2 {
    font-size: 25px;
    line-height: 36px;
    letter-spacing: -.005em;
    color: rgb(215, 215, 215);
    margin: 0;
    font-weight: lighter;
}

a {
    color: white;
}
</style>
