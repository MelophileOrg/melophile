<template>
  <div class="login">
    <NavBar path=""/>
    <div id="main">
      <BigTitle :top="true"/>
      <h1 id="title">Grant Access for More Features</h1>
      <button @click="authorize" id="authorize">Authorize</button>
      <button id="learnmore">Learn More</button>
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
  margin-top: 10px;
  font-weight: lighter;
}

button {
  display: block;
  margin: 0 auto;
  border: 0;
  border-radius: 10px;
  font-weight: bolder;
}

button#authorize {
  font-size: 20px;
  padding: 15px 35px;
  margin-top: 25px;
  color: rgb(255, 255, 255);
  background: radial-gradient(rgb(30, 215, 95), rgb(18, 207, 84));
}

button#learnmore {
  padding: 5px 10px;
  font-size: 12px;
  color: white;
  background: rgba(0,0,0,0);
}
</style>
