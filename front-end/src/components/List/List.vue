<template>
    <div class="List">
        <div v-for="item in list" :key="type + item">
            <ListItem :id="item" :type="type" />
        </div>
    </div>
</template>

<script>
import ListItem from '@/components/List/ListItem.vue'

export default {
    name: 'List',
    props: {
        type: Number,
    },
    components: {
        ListItem
    },
    computed: {
        list() {
            return this.$store.state.data.list.list;
        },
        tracks() {
            return this.$store.state.data.list.tracks;
        },
        artists() {
            return this.$store.state.data.list.artists;
        },
        albums() {
            return this.$store.state.data.list.albums;
        },
        playlists() {
            return this.$store.state.data.list.playlists;
        },

    },
    created() {
        let missing = [];
        console.log(this.list);
        for (let i = 0; i < this.list.length; i++) {
            if ((this.type == 0 && !(this.list[i] in this.tracks)) || (this.type == 1 && !(this.list[i] in this.artists)) || (this.type == 2 && !(this.list[i] in this.album)) || (this.type == 3 && !(this.list[i] in this.playlists))) {
                missing.push(this.list[i]);
            }
        }
        this.$socket.client.emit('requestListTracks', {list: missing, type: this.type});
    }
};
</script>


<style scoped>
.List {
    

}
</style>