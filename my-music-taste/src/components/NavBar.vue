<template>
  <div class="navbar">
    <div id="large-navbar" class="contents">
      <div id="title">
        <div class="medium-logo" id="logo"/>
        <h1>My Music Taste</h1>
      </div>
      <NavButton path="home" title="Home" image="home" :active="path == 'home'"/>
      <NavButton path="search" title="Song Analysis" image="search" :active="path == 'song' || path == 'songs'"/>
      <h2>Your Library</h2>
      <NavButton path="library" title="Library" image="library" :active="path == 'library' || path == 'save'"/>
      <NavButton path="charts" title="Charts" image="chart" :active="path == 'charts' || path == 'chart'"/>
      <h2>Social</h2>
      <NavButton path="myprofile" title="My Profile" image="profile" :active="path == 'myprofile'"/>
      <NavButton path="profiles" title="Public Profiles" image="public" :active="path == 'profiles' || path == 'profile'"/>
    </div>
    <div id="small-navbar" class="contents">

    </div>
  </div>
</template>

<script>
import NavButton from '@/components/NavButton.vue'

export default {
  name: 'navbar',
  data() {
    return {
      path: this.$router.currentRoute.name
    }
  },
  components: {
    NavButton
  },
  methods: {
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
  color: white;
  position: relative;
  
}

#large-navbar {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #121212;
  width: 260px;
  bottom: 0;
}

#small-navbar {
  display: block;
  width: 100%;
  height: 100%;
}

.contents {
  padding: 24px 0px;
  height: calc(100% - 48px);
}

.contents h2 {
  font-size: 11px;
  color: #b3b3b3;
  text-transform: uppercase;
  letter-spacing: .16em;
  margin: 10px 20px;
  margin-top: 24px;
  margin-left: 32px;
  text-align: left;
  cursor: default;
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

#title {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 30px;
  margin-top: 8px;
  margin-bottom: 16px;
}

#title h1 {
  font-size: 18px;
  margin: 0;
  margin-left: 12px;
  letter-spacing: .015em;
}

.medium-logo {
  display: block;
  width: 32px;
  height: 32px;
}

#logo {
  background-image: url('../assets/icons/kiwi2.svg');
  background-size: 100% 100%;
}
</style>