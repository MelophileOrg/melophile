<template>
    <div class="ListTrack flex flex-align-center">
      <div @click="play" class="item-img-div" style="position: relative;">
        <img v-on:load="imageLoaded = true" :class="{imageLoaded: imageLoaded}" class="item-img" :src="track.images[0].url"/>
        <img class="item-play-button" src="../../assets/general/play.svg"/>
      </div>
      <div class="item-details">
        <p class="item-name" @click="route">{{track.name}}</p>
        <div class="flex flex-align-center">
          <p class="artist" v-for="(artist, index) in track.artists" :key="track._id + '-' + artist._id">{{artist.name}}{{comma(index, track.artists.length)}}</p>
        </div>
      </div>
    </div>
</template>

<script>


export default {
  name: 'ListTrack',
  props: {
    track: Object,
  },
  data: () => ({
    imageLoaded: false,
  }),
  methods: {
    route() {
      this.$router.push('/track/' + this.track._id);
    },
    play() {
      this.$emit('play');
    },
    comma(index, length) {
      if (index < length - 1) return ",";
      else return "";
    }
  }
}
</script>

<style scoped>
.ListTrack {
}

div.item-img-div {
  --size: 58;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
}

div.item-img-div:hover {
  cursor: pointer;
}

img.item-img {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all .3s ease-out;
}

img.item-img.imageLoaded {
  opacity: 1;
}

img.item-play-button {
  position: absolute;
  max-width: calc((var(--size) - 10) * 1px);
  max-height: calc((var(--size) - 10) * 1px);
  left: 5px; right: 0;
  top: 5px; bottom: 0;
  opacity: 0;
  transform: scale(.5, .5);
  transition: all .2s ease;
}

div.item-img-div:hover img.item-play-button {
  opacity: 1;
  transform: scale(1, 1);
}

div.item-details {
  margin-left: 10px;
}

p.item-name {
  color: rgba(255, 255, 255, 0.897);
  margin: 0;
  transition: all .2s ease;
}

p.item-name:hover {
  color: var(--green);
  cursor: pointer;
}

p.artist {
  color: rgba(255, 255, 255, 0.24);
  font-size: .9rem;
  font-weight: lighter;
  margin: 0;
  margin-right: 5px;
  transition: all .2s ease;
}

p.artist:hover {
  color: var(--green);
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>