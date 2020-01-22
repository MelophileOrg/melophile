<template>
  <div class="ListTrack">
        <div v-if="dataRecieved">
            <div class="img" :style="{backgroundImage: 'url(' + trackData.image + ')'}"/>
            <h1>{{trackData.name}}</h1>
        </div>
        <h1 v-else>{{id}}</h1>
  </div>
</template>

<script>

export default {
    name: 'ListTrack',
    props: {
        id: String,
    },
    data: () => ({
        dataRecieved: false,
        interval: null,
    }),
    methods: {
        checkRequest() {
            if (this.$store.state.data.list.tracks[this.id] != null) {
                clearInterval(this.interval);
                this.dataRecieved = true;
            }
        }
    },
    computed: {
        tracks() {
            return this.$store.getters.tracks;
        },
        trackData() {
            return this.tracks[this.id];
        },
    },
    async created() {
        try {
            if (!(this.id in this.tracks)) {
                this.$socket.client.emit('requestListTrack', {_id: this.id});
                this.interval = setInterval(this.checkRequest, 100);
            } else {
                this.dataRecieved = true;
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