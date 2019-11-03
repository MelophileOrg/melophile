<template>
  <div id="main-flex" class="login">
    <div id="large">
      <button id="deny">No Thanks</button>
      <div id="title-div">
        <img src="../../assets/icons/kiwi2.svg"/>
        <h1>My Music Mood</h1>
      </div>
      <h1>View an indepth analysis of your music taste!</h1>
      <button id="authorize" @click="login">Authorize with Spotify</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    login() {
      this.$store.dispatch('inicializeGetToken');
    }
  }
}
</script>

<style scoped>
#large {
  width: 100vw;
  height: 100vh;
  position: relative;
}

#deny {
  background: rgba(5, 5, 5, 0);
  color: rgba(255, 255, 255, 0.61);
  font-size: 1em;
  border: 0;
  position: absolute;
  right: 2%;
  top: 2%;
  transition: all .4s ease;
}

#deny:hover {
  color: white;
}

h1 {
  color: white;
}

#authorize {
  background: rgb(40, 214, 40);
  color: white;
  display: block;
  border: 0;
  padding: 20px;
  font-size: 2em;
  font-weight: bolder;
  border-radius: 10px;
  margin: 0 auto;
}

</style>