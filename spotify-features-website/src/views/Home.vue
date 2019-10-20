<template>
  <div class="home">
    <NavBar path="home" />
    <div id="main">
      <BigTitle id="title" align="left"/>

      <Thank/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Thank from '@/components/Thank.vue'
import AppsCarousel from '@/components/AppsCarousel.vue'
import BigTitle from '@/components/BigTitle.vue'

export default {
  name: 'home',
  components: {
    NavBar,
    Thank,
    AppsCarousel,
    BigTitle
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
    margin-left: 64px;
}
.home {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
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
