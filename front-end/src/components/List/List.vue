<template>
    <div class="List">
        <div v-for="item in list" :key="type + item">
            <ListItem :id="item" :type="type" v-if="display"/>
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
    data() {
        return {
            display: false,
        }
    },
    computed: {
        list() {
            return this.$store.state.list.list;
        },
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
    },
    async created() {
        let missing = [];
        for (let i = 0; i < this.list.length; i++) {
            if ((this.type == 0 && !(this.list[i] in this.tracks)) || (this.type == 1 && !(this.list[i] in this.artists)) || (this.type == 2 && !(this.list[i] in this.album)) || (this.type == 3 && !(this.list[i] in this.playlists))) {
                await this.$store.dispatch('createListObject', {id: this.list[i], type: this.type});
                missing.push(this.list[i]);
            }
        }
        this.$socket.client.emit('requestListTracks', {list: missing, type: this.type});
        this.display = true;
    }
};
</script>


<style scoped>
.List {
    

}
</style>