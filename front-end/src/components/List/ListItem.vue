<template>
  <div class="ListItem pop-small" :style="{'--index': + (index - 1 + delay)}">
      <div class="img" @click="play" :style="{backgroundImage: 'url(' + image + ')'}">
        <div class="play-button"/>
      </div>
      <div class="limit">
        <ListTrack :track="item" v-if="type == 0"/>
        <ListArtist :artist="item" v-if="type == 1"/>
        <ListAlbum :album="item" v-if="type == 2"/>
        <ListPlaylist :playlist="item" v-if="type == 3"/>
      </div>
  </div>
</template>

<script>
import ListTrack from '@/components/List/ListTrack.vue'
import ListArtist from '@/components/List/ListArtist.vue'
import ListAlbum from '@/components/List/ListAlbum.vue'
import ListPlaylist from '@/components/List/ListPlaylist.vue'

export default {
    name: 'ListItem',
    components: {
        ListTrack,
        ListArtist,
        ListAlbum,
        ListPlaylist,
    },  
    props: {
        index: Number,
        item: Object,
        type: Number,
        delay: Number,
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
      }
    }, 
};
</script>


<style scoped>
.ListItem {
    --index: 0;
    display: flex;
    width: calc(100% - 12px);
    padding: 15px 10px;
    background-color: rgba(255, 255, 255, 0.018);
    margin: 5px auto;
    border-radius: 3px;
    animation: hide calc(var(--index) * .1s) linear, slide-up .3s ease calc(var(--index) * .1s);
    transition: all .1s ease-in-out;
}



.ListItem:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.ListItem:hover .img {
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
}

.img .play-button {
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
</style>