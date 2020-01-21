<template>
  <div class="ListTrack">
        <div v-if="loaded">
            <div class="img" :style="{backgroundImage: 'url(' + tracks[id].image + ')'}"/>
            <h1>{{tracks[id].name}}</h1>
        </div>
  </div>
</template>

<script>

export default {
    name: 'ListTrack',
    props: {
        id: String,
    },
    data: () => ({
       requested: false,
    }),
    methods: {

    },
    computed: {
        tracks() {
            return this.$store.state.data.list.tracks;
        },
        requests() {
            return this.$store.state.data.list.resolutions;
        },
        loaded() {
            if (!this.requested) {
                if (this.id in this.tracks)
                    return true;
            } else {
                if (this.requests[this.id]) {
                    this.$store.dispatch('deleteListRequest', {_id: "track-" + this.id});
                    return true;
                }
            }   
            return false;
        }
    },
    watch: {
    },
    async created() {
        try {
            if (!(this.id in this.tracks)) {
                await this.$store.dispatch('createListRequest', {_id: "track-" + this.id});
                this.requested = true;
                this.$socket.client.emit('requestListTrack', {_id: this.id});
            }
        } catch(error) {
            console.log(error);
        }

    }
};
</script>


<style scoped>
.ListTrack {
    display: flex;
    width: 100%;
    padding: 10px;
    background-color: rgb(255,255,255,.2);
}

.img {
    display: block;
    width: 30px;
    height: 30px;
    background-size: 100% 100%;
    background-position: center center;
}
</style>