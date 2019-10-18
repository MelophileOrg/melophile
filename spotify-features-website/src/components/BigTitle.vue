<template>
    <div class="BigTitle">
        <div id="big-title">
            <img src="../assets/icons/spotify.svg"/>
            <h1>Spotify Features</h1>
        </div>
    </div>
</template>

<script>
export default {
  name: 'BigTitle',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#big-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15vh;
}
img {
  display: block;
  width: 70px;
  height: 70px;
  margin-right: 20px;
}
#big-title h1 {
  color: white;
  font-size: 70px;
  margin: 0px;
}
</style>
