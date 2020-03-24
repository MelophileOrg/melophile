<template>
    <div class="ListItem">
        <ListTrack @play="play" v-if="type == 'track'" :track="data"/>
        <ListArtist @play="play" v-if="type == 'artist'" :artist="data"/>
        <ListPlaylist @play="play" v-if="type == 'playlist'" :playlist="data"/>
        <ListAlbum @play="play" v-if="type == 'album'" :album="data"/>
    </div>
</template>

<script>
import ListTrack from '@/components/Lists/ListTrack.vue'
import ListArtist from '@/components/Lists/ListArtist.vue'
import ListPlaylist from '@/components/Lists/ListPlaylist.vue'
import ListAlbum from '@/components/Lists/ListAlbum.vue'

export default {
    name: 'ListItem',
    components: {
        ListTrack,
        ListArtist,
        ListPlaylist,
        ListAlbum
    },
    props: {
        type: String,
        data: Object,
    },
    methods: {
        play() {
            this.$emit('play');
        }
    }
}
</script>

<style scoped>
.ListItem {
    margin: 15px 0px;
}
</style>