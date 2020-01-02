<template>
    <div class="topTracks">
        <div class="menu">
          <h1 @click="test" class="title">Top Tracks</h1>
          <Select :options="selector"/>
        </div>
        <div class="track-list">
            <div @click="toTrack(track.id)" v-for="(track, index) in topTracks.tracks" :key="'toptracks-' + track.id" class="track" :class="{bordertop: index == 0}">
                <div class="track-image" :style="{backgroundImage: 'url(\'' + track.album.images[0].url + '\')'}" />
                <p class="index">{{index + 1}}</p>
                <p class="name">{{track.name}}</p>
                <div id="popularity">
                  <div v-for="i in 5" :key="'toptracks'+ i" class="popularity-circle" :class="{active: track.popularity / 100 > i / 5}"/>
                </div>
            </div>
        </div>
        <!-- <div class="content" :class="{background: color.a != 0}" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}"> -->

        <!-- </div> -->
    </div>
</template>

<script>
import Select from '@/components/Menu/Select.vue'

export default {
  name: 'topTracks',
  components: {
    Select,
  },
  props: {
    topTracks: Object,
    override: Boolean,
    color: Object,
  },
  data() {
    return {
      selector: [
        {value: "popularity", text: "Popularity", color: {r: 255, g: 255, b: 255}},
        {value: "valence", text: "Happiness", color: {r: 242, g: 142, b: 43}},
        {value: "energy", text: "Energy", color: {r: 89, g: 161, b: 79}},
        {value: "danceability", text: "Danceability", color: {r: 78, g: 121, b: 167}},
      ]
    }
  },
  methods: {
    toTrack(id) {
      this.$router.push("/songs/" + id);
    },
    test() {
      console.log(this.topTracks.tracks);
    }
  },
  computed: {
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
.topTracks {
    display: block;
    width: 100%;
    max-width: 475px;
}

.track-list {
  width: 100%;
}

.header {
  margin-top: 48px !important;
  margin-bottom: 16px;
}

.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}

.menu .title {
    font-size: 1.3em;
    color: rgba(255, 255, 255, 0.815);
    font-weight: lighter;
    text-align: left;
    display: inline-block;
    margin: 0 !important;
    margin-bottom: 0px !important;
    margin-top: 0px !important;
}

#popularity {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 75px;
}

.popularity-circle {
  display: block;
  width: 5px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 100%;
  border: 1px solid rgba(255, 255, 255, 0.151);
}

.popularity-circle.active {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgba(255, 255, 255, 0.836);
  
}

.content {
    display: flex;
    align-items: top;
    justify-content: space-around;
    border-radius: 5px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.05);
}

.content.background {
  --red: 255;
  --green: 255;
  --blue: 255;
  --alpha: 0;
  /* background: rgba(var(--red), var(--green), var(--blue), .2); */
}

.track {
    display: flex;
    justify-content: left;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.178);
    border-top: 0px;
}

.bordertop {
    border-top: 1px solid rgba(255, 255, 255, 0.178);
}

.track-image {
    display: block;
    width: 40px;
    height: 40px;
    background-size: 100% 100%;
    background-position: center center;
}

.track p {
    font-family: 'Roboto', sans-serif;
    text-align: left;
    margin: 0;
    color: white;
    font-size: .9em;
}

.track p.index {
    width: 25px;
    margin: 0 10px;
    text-align: center;
    color: rgba(255, 255, 255, 0.397);
}

.track:hover p.name {
    text-decoration: underline;
}
.track p.name {
    width: calc(100% - 25px - 20px - 40px - 75px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}


</style>