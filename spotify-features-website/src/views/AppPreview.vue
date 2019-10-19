<template>
  <div class="apppreview">
    <NavBar :path="app.path" />
    <div id="main">
        <div id="title-div">
            <AppImage :index="this.$store.state.index" :width="285"/>
            <h1>{{app.title}}</h1>
            <button @click="launch"/>
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AppImage from '@/components/AppImage.vue'

export default {
  name: 'apppreview',
  components: {
    NavBar,
    AppImage
  },
  methods: {
    getImgUrl(pic) {
      var images = require.context('../assets/icons', false, /\.svg$/)
      return images('./' + pic + ".svg");
    },
    launch() {
      this.$router.push("/" + this.app.path);
    }
  },
  computed: {
    app() {
        return this.$store.state.apps[this.$store.state.index];
    },
    token() {
      return this.$store.state.access_token;
    },
  },
  created() {

  }
}
</script>

<style scoped>
.apppreview {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

#main {
    padding-top: 28px;
}

#title-div {
    display: block;
    width: 285px;
    margin-left: 32px;
}

#app-photo {
    display: block;
    width: 285px;
    height: 285px;
    margin: 0 auto;
    background: white;
}

h1 {
  font-size: 36px;
  line-height: 44px;
  letter-spacing: -.005em;
  cursor: default;
  color: white;
  text-align: left;
}
</style>
