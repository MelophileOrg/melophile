<template>
  <div class="ListItem slide-up elevation-1" :style="{'--delay': + (index - 1 + delay)}">
    <h1 class="number" v-if="number && feature == null">{{index + 1}}</h1>
    <div class="feature" v-if="feature != null">
      <v-progress-circular color="#52e3c2" :size="53" :value="processValue">{{processFeature}}</v-progress-circular>
    </div>
    <div class="img" @click="play" v-if="type != 4" :style="{backgroundImage: 'url(' + image + ')'}">
      <div class="play-button"/>
    </div>
    <div class="img-flex" v-if="type == 4">
      <div class="small-img" v-for="(img, imagenum) in image" :key="item.name + 'image' + imagenum" :style="{backgroundImage: 'url(' + img + ')'}"/>
    </div>
    <div class="limit">
      <ListTrack :track="item" v-if="type == 0"/>
      <ListArtist :artist="item" :trackNum="trackNum" v-if="type == 1"/>
      <ListAlbum :album="item" v-if="type == 2"/>
      <ListPlaylist :playlist="item" v-if="type == 3"/>
      <ListGenre :genre="item" v-if="type == 4"/>
    </div>
  </div>
</template>

<script>
import ListTrack from '@/components/List/ListTrack.vue'
import ListArtist from '@/components/List/ListArtist.vue'
import ListAlbum from '@/components/List/ListAlbum.vue'
import ListPlaylist from '@/components/List/ListPlaylist.vue'
import ListGenre from '@/components/List/ListGenre.vue'

let constants = require('../../store/constants.js');
let audioFeaturesData = constants.audioFeatures;

export default {
    name: 'ListItem',
    components: {
        ListTrack,
        ListArtist,
        ListAlbum,
        ListPlaylist,
        ListGenre,
    },  
    props: {
        index: Number,
        item: Object,
        type: Number,
        delay: Number,
        number: Boolean,
        trackNum: Boolean,
        feature: String,
    },
    methods: {
      play() {
        if (this.type == 0)
          this.jimmy.playTrack(this.item._id);
        else if (this.type == 1)
          this.jimmy.playArtist(this.item._id);
        else if (this.type == 2)
          this.jimmy.playAlbum(this.item._id);
        else if (this.type == 3)
          this.jimmy.playPlaylist(this.item._id);
      }
    },
    computed: {
      image() {
        if (this.item.image != "Undefined")
          return this.item.image;
        return "https://i.ibb.co/m6qD5cD/undefined-image.png";
      },
      jimmy() {
        return this.$store.state.jimmy;
      },
      processFeature() {
        if (this.feature != 'tempo') {
          return Math.round(this.item[this.feature] * 100) + '%';
        }
        return Math.round(this.item[this.feature]);
      },
      processValue() {
        if (this.feature != 'tempo') {
          return this.item[this.feature] * 100;
        }
        return (this.item[this.feature] / 225) * 100;
      },
      color() {
        return 'rgb(' + audioFeaturesData[this.feature].color.red + ',' + audioFeaturesData[this.feature].color.green + ',' + audioFeaturesData[this.feature].color.blue + ')';
      }
    }, 
};
</script>


<style scoped>
.ListItem {
    display: flex;
    width: calc(100%);
    padding: 15px 10px;
    background-color: rgba(255, 255, 255, 0.018);
    margin: 5px auto;
    margin-left: 0px;
    border-radius: 3px;
    align-items: center;
    transition: all .1s ease-in-out;
    overflow: auto;
    position: relative;
}


.ListItem::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: #32323e;
}

.ListItem::-webkit-scrollbar
{
    height: 5px;
    background-color: rgba(6, 6, 6, 0.007)
}

.ListItem::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.288);
}

.feature {
    display: block;
    width: 55px;
    height: 55px;
    opacity: .9;
    flex-shrink: 0;
    margin-right: 15px;
}

.ListItem:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.ListItem:hover .img {
  transform: scale(1.1, 1.1);
}

.ListItem:hover .img-flex {
  transform: scale(1.1, 1.1);
}

.img {
  display: block;
  width: 55px;
  height: 55px;
  background-size: auto 100%;
  background-position: center center;
  margin-right: 15px;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
}

.img-flex {
  display: flex;
  flex-wrap: wrap;
  width: 55px;
  height: 55px;
  margin-right: 15px;
  border-radius: 3px;
  position: relative;
}

.small-img {
  display: block;
  width: calc(27px);
  height: calc(27px);
  background-size: auto 100%;
  background-position: center center;
}

.img .play-button {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 60% 60%;
  background-image: url('../../assets/icons/play.svg');
  opacity: 0;
  transform: scale(.6, .6);
  transition: all .3s ease;
}

.img:hover .play-button {
  opacity: 1;
  transform: scale(1, 1);
}

.limit {
  max-width: calc(100% - 70px);
}

.number {
  font-family: 'Open Sans', sans-serif;
  width: 28px;
  margin: 0 2px;
  margin-right: 10px;
  font-size: 1.5rem;
  font-weight: lighter;
  color: rgba(255, 255, 255, 0.267);
  flex-shrink: 0;
}

.img-flex .play-button {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 60% 60%;
  background-image: url('../../assets/icons/play.svg');
  opacity: 0;
  transform: scale(.6, .6);
  transition: all .3s ease;
}

.img-flex:hover .play-button {
  opacity: 1;
  transform: scale(1, 1);
}
</style>