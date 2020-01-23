<template>
  <div class="ListItem">
      <ListTrack :id="id" v-if="type == 0"/>
      <ListArtist :id="id" v-if="type == 1"/>
      <ListAlbum :id="id" v-if="type == 2"/>
      <ListPlaylist :id="id" v-if="type == 3"/>
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
        id: String,
        type: Number,
    },
    computed: {
        tracks() {
            return this.$store.state.list.tracks;
        },
        artists() {
            return this.$store.state.list.artists;
        },
        albums() {
            return this.$store.state.list.albums;
        },
        playlists() {
            return this.$store.state.list.playlists;
        },
    }
};
</script>


<style scoped>
.ListItem {
    
}
</style>