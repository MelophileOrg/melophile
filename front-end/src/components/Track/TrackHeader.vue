<template>
    <div class="trackheader" :class="{background: colors}" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}">
      <div class="trackimage" v-if="trackData != null" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
      <div class="trackimage null" v-else/>
      <div class="content">
        <h1 v-if="trackData != null">{{trackData.name}}</h1>
        <div v-if="trackData != null" class="artists">
          <h2 @click="toArtist(artist.id)" v-for="(artist, index) in trackData.artists" :key="artist.id">{{artist.name}}{{comma(index, trackData.artists.length)}}</h2>
        </div>
        <div class="menu">
          <button @click="changeTab(0)" :class="{active: tab == 0}">Overview</button>
          <button @click="changeTab(1)" :class="{active: tab == 1}">Analysis</button>
          <button @click="changeTab(2)" :class="{active: tab == 2}">Compairson</button>
        </div>
      </div>
    </div>
</template>

<script>
import analyze from 'rgbaster';

export default {
  name: 'trackheader',
  props: {
    trackData: Object,
    trackReady: Boolean,
  },
  data() {
    return {
      tab: 0,
      color: {r: 0, g: 0, b: 0, a: 0},
    }
  },
  methods: {
    changeTab(index) {
      this.tab = index;
      this.$emit('changeTab', this.tab);
    },
    toArtist(id) {
        this.$router.push('/artists/' + id);
    },
    comma(index, length) {
        if (index < length - 1) {
            return ",";
        }
        return "";
    },
    async dominantColor() {
      console.log("DOING IT");
      if (this.trackReady) {
        let result = await analyze(this.trackData.album.images[0].url, {ignore: ['rgb(0,0,0)']});
        let re = RegExp(/\d+/i, 'g');
        this.color.r = parseInt(re.exec(result[0].color), 10);
        this.color.g = parseInt(re.exec(result[0].color), 10);
        this.color.b = parseInt(re.exec(result[0].color), 10);
        this.color.a = .2;
      }
    },
  },
  computed: {
    colors() {
      if (this.trackReady) {
        this.dominantColor();
        return true;
      }
      return false;
    },
    red() {
      return this.color.r;
    },
    green() {
      return this.color.g;
    },
    blue() {
      return this.color.b;
    },
    alpha() {
      return this.color.a;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.trackheader {
    display: flex;
    width: 100%;
    min-height: 80px;
    transition: all .5s ease;
    background: rgba(255, 255, 255, 0.05);
    position: relative;
}

.trackimage {
  display: block;
  width: 140px;
  height: 140px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

.trackimage.null {
  background-image: linear-gradient(rgba(46, 46, 46, 0.541), rgba(90, 90, 90, 0.541), rgba(46, 46, 46, 0.541));
  background-repeat: repeat;
  background-size: 100% 100%;
  animation: background-cycle 1s linear 0s infinite;
}

@keyframes background-cycle {
  0% {
    background-position: -100% -100% !important;
  }
  100% {
    background-position: 100% 100% !important;
  }
  
}

.trackheader.background {
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 0;
  background: rgba(var(--red), var(--green), var(--blue), var(--alpha));
}

.content {
  display: block;
  width: calc(100% - 140px);
  height: calc(140px - 24px);
  padding: 24px;
  padding-bottom: 0px;
  position: relative;
}

h1 {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.89);
  font-weight: lighter;
  text-align: left;
  margin: 0px;
  font-size: 1.7em;
}

h2 {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.726);
  font-weight: lighter;
  text-align: left;
  margin: 0px;
  font-size: 1em;
  cursor: pointer;
  margin-right: 10px;
}

h2:hover {
    text-decoration: underline;
}

.menu {
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
}

.menu button {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.767);
  font-weight: lighter;
  font-size: 1em;
  background: rgba(255, 255, 255, 0);
  border: 0px;
  border-bottom: 3px solid rgba(40, 180, 40, 0);
  transition: all .3s ease;
  max-width: 150px;
  width: 50vw;
  padding: 5px 0px;
}

.menu button:hover {
  background: rgba(255, 255, 255, 0.075);
}

.menu button.active {
  border-bottom: 3px solid #1ed75f;
}

.artists {
    display: flex;
    flex-wrap: wrap;
    max-width: 100vw;
    margin-top: 5px;
}
</style>
<style scoped>
@media screen and (max-width: 720px) {
    .trackheader {
        width: 100vw !important;
        height: 80vw !important;
    }

    .trackimage {
        position: absolute;
        background-size: 100% auto;
        left: 0px;
        top: 0px;
        opacity: .25;
        width: 100vw;
        height: 80vw;
    }

    .content {
        width: 100%;
        height: calc(80vw - 24px);
    }

    h1 {
        color: rgba(255, 255, 255, 0.952);
        text-align: center;
        font-size: 2em;
        margin-top: 10vw;
    }

    h2 {
        color: white;
        text-align: center;
    }
    .menu {
        left: 0px !important;
        width: 100vw;
        justify-content: center;
    }
    
    .menu button {
        width: 30%;
    }

    .artists {
        display: flex;
        justify-content: center;
    }

    .trackheader.background {
      --red: 255;
      --green: 255;
      --blue: 255;
      --alpha: 0;
      background: rgba(var(--red), var(--green), var(--blue), 0);
    }
}
</style>