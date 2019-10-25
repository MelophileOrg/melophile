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
    route(path, index) {
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
  height: 60px;
}

@media screen and (min-width: 400px) {
  .navbar {
    display: block;
    width: 260px;
    height: 100vh;
  }
}
</style>