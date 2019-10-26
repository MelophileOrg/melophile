<template>
  <div class="navbar">

  </div>
</template>

<script>
export default {
  name: 'navbar',
  props: {
    path: String,
  },
  methods: {
    route(path) {
      if (path == this.path)
        return;
      this.$router.push("/" + path);
    },
    toggleMenu() {
      this.menuShow = !this.menuShow;
    },
    getImgUrl(pic) {
      var images = require.context('../assets/icons', false, /\.svg$/)
      return images('./' + pic + ".svg");
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 70px;
  background-color: #121212;
  position: relative;
}

#large-navbar {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

#small-navbar {
  display: block;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 720px) {
  .navbar {
    display: block;
    width: 260px;
    height: 100vh;
    background-color: #121212;
  }

  #large-navbar {
    display: block;
  }
}
</style>