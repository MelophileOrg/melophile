<template>
    <div class="topTracks">
        <h1 class="section-title">Top Tracks</h1>
        <div class="track-list">
            <div @click="toTrack(track.id)" v-for="(track, index) in topTracks.tracks" :key="'toptracks-' + track.id" class="track" :class="{bordertop: index == 0}">
                <div class="track-image" :style="{backgroundImage: 'url(\'' + track.album.images[0].url + '\')'}" />
                <p class="index">{{index + 1}}</p>
                <p class="name">{{track.name}}</p>
            </div>
        </div>
        <!-- <div class="content" :class="{background: color.a != 0}" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}"> -->

        <!-- </div> -->
    </div>
</template>

<script>


export default {
  name: 'topTracks',
  props: {
    topTracks: Object,
    override: Boolean,
    color: Object,
  },
  data() {
    return {
  
    }
  },
  methods: {
    toTrack(id) {
      this.$router.push("/songs/" + id);
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
    width: calc(100% - 25px - 20px - 40px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.track-list {
    width: 100%;
    max-width: 400px;
}
</style>