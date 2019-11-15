<template>
  <div class="navbar">
    <div id="large-navbar" class="contents">
      <div id="title">
        <div class="medium-logo" id="logo"/>
        <h1>My Music Taste</h1>
      </div>
      <NavButton path="home" title="Home" image="home" :active="path == 'home'"/>
      <NavButton path="recommend" title="Discover" image="heart" :active="path == 'recommend'"/>
      <NavButton path="search" title="Search" image="search" :active="path == 'song' || path == 'genre'|| path == 'artist'|| path == 'search'"/>
      <h2>Your Library</h2>
      <NavButton path="libraryanalysis" title="Big Picture" image="characteristics" :active="path == 'libraryanalysis' || path == 'librarysave'"/>
      <NavButton path="library" title="Library" image="library" :active="path == 'library' || path == 'librarysong' || path == 'libraryartist' || path == 'librarygenre'"/>
      <NavButton path="charts" title="Charts" image="chart" :active="path == 'charts'"/>
      <h2>Social</h2>
      <NavButton path="myprofile" title="My Profile" image="profile" :active="path == 'myprofile'"/>
      <NavButton path="profiles" title="Public Profiles" image="public" :active="path == 'profiles'"/>
    </div>
    <div id="small-navbar-space"/>
    <div id="small-navbar" :class="{fixedsmall: menuShow}">
      <div id="small-title">
        <div class="small-logo" id="logo"/>
        <h1>My Music Taste</h1>
      </div>
      <button id="open-menu" @click="toggleMenu"/>
    </div>
    <div v-if="menuShow" id="pop-up-menu">
      <NavButton path="home" title="Home" image="home" :active="path == 'home'"/>
      <NavButton path="recommend" title="Discover" image="heart" :active="path == 'recommend'"/>
      <NavButton path="search" title="Search" image="search" :active="path == 'song' || path == 'genre'|| path == 'artist'|| path == 'search'"/>
      <h2>Your Library</h2>
      <NavButton path="libraryanalysis" title="Big Picture" image="characteristics" :active="path == 'libraryanalysis' || path == 'librarysave'"/>
      <NavButton path="library" title="Library" image="library" :active="path == 'library' || path == 'librarysong' || path == 'libraryartist' || path == 'librarygenre'"/>
      <NavButton path="charts" title="Charts" image="chart" :active="path == 'charts'"/>
      <h2>Social</h2>
      <NavButton path="myprofile" title="My Profile" image="profile" :active="path == 'myprofile'"/>
      <NavButton path="public" title="Public Profiles" image="public" :active="path == 'public'"/>
    </div>
  </div>
</template>

<script>
import NavButton from '@/components/Navigation/NavButton.vue'

export default {
  name: 'navbar',
  data() {
    return {
      path: this.$router.currentRoute.name,
      menuShow: false,
    }
  },
  components: {
    NavButton
  },
  methods: {
    routed() {
      this.menuShow = false;
    },
    toggleMenu() {
      this.menuShow = !this.menuShow;
    },
    getImgUrl(pic) {
      var images = require.context('../../assets/icons', false, /\.svg$/)
      return images('./' + pic + ".svg");
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#pop-up-menu {
  width: 100vw;
  height: calc(100vh - 70px);
  position: fixed;
  left: 0px;
  top: 70px;
  background-color: #121212;
  z-index: 10;
  display: block;
  animation: slide-right .4s ease;
}

@keyframes slide-right {
  from {
    transform: translateX(-100vw);
  }
}

.navbar {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 70px;
  background-color: #121212;
  color: white;
  position: relative;
  z-index: 10;
  
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100vw - 40px);
  padding: 0 20px;
}

#small-navbar-space {
  display: none;
}

.fixedsmall {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 70px;
  z-index: 100;
  background-color: #121212;
}

#small-title {
  display: flex;
  align-items: center;
}

#small-title h1 {
  margin: 0;
  font-size: 23px;
  margin-left: 12px;
}

.contents {
  padding: 24px 0px;
  height: calc(100% - 48px);
}

.contents h2 {
  font-size: 10px;
  color: #b3b3b3;
  text-transform: uppercase;
  letter-spacing: .16em;
  margin: 10px 20px;
  margin-top: 24px;
  margin-left: 32px;
  text-align: left;
  cursor: default;
}

h2 {
  font-size: 13px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: .16em;
  margin: 10px 20px;
  margin-top: 30px;
  margin-left: 18px;
  text-align: left;
  cursor: default;
}
@media screen and (max-width: 720px) {
  h2 {
    margin-left: 32px !important;
  }
}

@media screen and (min-width: 720px) {
  .navbar {
    display: block;
    width: 260px;
    height: 100vh;
    background-color: #121212;
  }

  .fixedsmall {
    position: relative;
    left: 0px;
    top: 0px;
  }

  #large-navbar {
    display: block;
  }

  #small-navbar {
    display: none;
  }

  #pop-up-menu {
    display: none;
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

.small-logo {
  display: block;
  width: 32px;
  height: 32px;
}

#open-menu {
  display: block;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0);
  background-image: url('../../assets/icons/menu.svg');
  background-size: 100% 100%;
  background-position: center center;
  
  border: 0;
}

#logo {
  background-image: url('../../assets/icons/kiwi2.svg');
  background-size: 100% 100%;
}
</style>