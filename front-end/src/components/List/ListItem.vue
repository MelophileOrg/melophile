<template>
  <div class="ListItem pop-small" :style="{'--index': + (index - 1 + delay)}">
      <div class="img" :style="{backgroundImage: 'url(' + image + ')'}"/>
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
    computed: {
      image() {
        if (this.item.image != "Undefined")
          return this.item.image;
        return "https://i.ibb.co/m6qD5cD/undefined-image.png";
      }
    }
};
</script>


<style scoped>
.ListItem {
    --index: 0;
    display: flex;
    width: calc(100% - 12px);
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.068);
    margin: 5px auto;
    border-radius: 3px;
    animation: hide calc(var(--index) * .1s) linear, slide-up .3s ease calc(var(--index) * .1s);
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

.limit {
  max-width: calc(100% - 70px);

}
</style>