<template>
  <div class="home maindiv">
    <NavBar path="home" />
    <div id="main">
      <BigTitle id="title" align="left"/>
      <HomeCarousel title="Available Apps" :apps="available"/>
      <HomeCarousel title="Under Development" :apps="development"/>
      <Thank/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Thank from '@/components/Thank.vue'
import BigTitle from '@/components/BigTitle.vue'
import HomeCarousel from '@/components/HomeCarousel.vue'

export default {
  name: 'home',
  components: {
    NavBar,
    Thank,
    BigTitle,
    HomeCarousel
  },
  methods: {
  },
  computed: {
    token() {
      return this.$store.state.access_token;
    },
    apps() {
      return this.$store.state.apps;
    },
    available() {
      return this.apps.filter(function(app) {
        return app.state;
      });
    },
    development() {
      return this.apps.filter(function(app) {
        return !app.state;
      });
    }
  },
  created: function() {
    setInterval(this.showPath,1000);
  }
}
</script>

<style scoped>

#title {
  margin: 60px 64px;
  margin-bottom: 50px;
}


h1 {
  font-size: 2.5em;
  margin: 30px 32px;
  margin-top: 50px;
  color: white;
  text-align: left;
}

#main {
  overflow-y: scroll;
}
</style>
