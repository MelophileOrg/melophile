<template>
    <div class="artistheader" :class="{background: tracksLoaded}" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}">
      <div class="artistimage" v-if="artistData != null" :style="{backgroundImage: 'url(\'' + artistData.image + '\')'}"/>
      <div class="artistimage null" v-else/>
      <div class="content">
        <h1 v-if="artistData != null">{{artistData.name}}<h2 class="small" v-if="artistData != null">{{trackNum}}</h2></h1>
        <h2 v-if="artistData != null">{{trackNum}}</h2>
        <div class="menu">
          <button @click="changeTab(0)" :class="{active: tab == 0}">Overview</button>
          <button @click="changeTab(1)" :class="{active: tab == 1}">Liked Tracks</button>
          <button @click="changeTab(2)" :class="{active: tab == 2}">Compairson</button>
        </div>
      </div>
    </div>
</template>

<script>
import analyze from 'rgbaster';

export default {
  name: 'artistheader',
  props: {
    artistData: Object,
    tracksLoaded: Boolean,
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
    async dominantColor() {
      if (this.tracksLoaded) {
        let result = await analyze(this.artistData.image);
        let re = RegExp(/\d+/i, 'g');
        this.color.r = parseInt(re.exec(result[0].color), 10);
        this.color.g = parseInt(re.exec(result[0].color), 10);
        this.color.b = parseInt(re.exec(result[0].color), 10);
        this.color.a = .2;
      }
    },
  },
  computed: {
    trackNum() {
      if (this.tracksLoaded) {
        this.dominantColor();
        if (this.artistData.tracks.length > 0)
          return this.artistData.tracks.length + " Liked Tracks";
        else 
          return "No Liked Tracks";
      }
      else {
        return "Loading";
      }
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
.artistheader {
  display: flex;
  width: 100%;
  min-height: 80px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  transition: all .5s ease;
}

.artistheader.background {
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 0;
  background: rgba(var(--red), var(--green), var(--blue), var(--alpha));
}


.artistimage {
  display: block;
  width: 140px;
  height: 140px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: 0% center;
}

.artistimage.null {
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

h1.null {
  display: inline-block;
  color: rgba(255, 255, 255, 0);
  background-image: linear-gradient(rgba(46, 46, 46, 0.541), rgba(90, 90, 90, 0.541), rgba(46, 46, 46, 0.541));
  background-repeat: repeat;
  animation: background-cycle 1s linear infinite;
}

h2.null {
  display: inline-block;
  color: rgba(255, 255, 255, 0);
  background-image: linear-gradient(rgba(46, 46, 46, 0.541), rgba(90, 90, 90, 0.541), rgba(46, 46, 46, 0.541));
  background-repeat: repeat;
  animation: background-cycle 1s linear infinite;
}

h2.small {
  display: none;
}

h2 {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.637);
  font-weight: lighter;
  text-align: left;
  margin: 0px;
  font-size: 1em;
  margin-top: 5px;
  margin-right: 10px;
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
</style>
<style scoped>
@media screen and (max-width: 720px) {
  .artistheader {
    width: 100vw !important;
    height: 80vw !important;
  }

  .artistimage {
    position: absolute;
    background-size: 100% auto;
    left: 0px;
    top: 0px;
    opacity: .5;
    width: 100vw;
    height: 80vw;
  }

  .content {
    width: 100%;
    height: calc(80vw - 24px);
  }

  h1 {
    position: absolute;
    color: rgba(255, 255, 255, 0.952);
    text-align: center;
    font-size: 3em;
    top: 50%; left: 0%;
    transform: translate(0%, -70%);
    width: 100%;
    max-height: 80vw;
  }
  .menu {
    left: 0px !important;
    width: 100vw;
    justify-content: center;
  }
  
  .menu button {
    width: 30%;
  }

  h2 {
    display: none;
    color: white;
    text-align: center;
  }

  h2.small {
    display: block;
    position: absolute;
    bottom: -25px;
    font-size: .4em !important;
    width: 100%;
  }

  .artistheader.background {
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 0;
    background: rgba(var(--red), var(--green), var(--blue), 0);
  }
}
</style>