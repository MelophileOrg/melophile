<template>
  <div class="login">
    <NavBar path=""/>
    <div id="main">
      <BigTitle :top="true"/>
      <h1 id="title">Login with Spotify to Start!</h1>
      <button @click="authorize" id="authorize">Authorize</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import BigTitle from '@/components/BigTitle.vue'

export default {
  name: 'login',
  components: {
    NavBar,
    BigTitle
  },
  methods: {
    authorize() {
      this.$store.dispatch('getAccessToken');
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  created() {
    if (this.inicialized)
    {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

#title {
  font-size: 36px;
  line-height: 44px;
  letter-spacing: -.005em;
  color: rgba(215, 215, 215, 0.767);
  margin: 0;
  margin-top: 15px;
  font-weight: lighter;
}

#main {
  padding-top: 5vw;
}

button {
  display: block;
  margin: 0 auto;
  border: 0;
  border-radius: 10px;
  font-weight: bolder;
}

button#authorize:hover {
  background: radial-gradient(rgb(252, 252, 252), rgb(236, 236, 236));
  color: rgb(18, 207, 84);
}

button#authorize {
  font-size: 20px;
  padding: 15px 35px;
  margin-top: 25px;
  color: rgb(255, 255, 255);
  transition: all .1s ease;
  background: radial-gradient(rgb(30, 215, 95), rgb(18, 207, 84));
}

button#learnmore {
  padding: 5px 10px;
  font-size: 12px;
  color: white;
  background: rgba(0,0,0,0);
}
</style>
