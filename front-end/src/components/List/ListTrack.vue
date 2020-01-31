<template>
    <div class="ListTrack">
        <div v-if="track != null">
            <h1 @click="routeTrack()">{{track.name}}</h1>
            <div class="flex sub-flex">
                <h2 @click="routeArtist(index)" v-for="(artist, index) in track.artists" :key="track._id + '-' + artist._id">{{artist.name + comma(index, track.artists.length)}}</h2>
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
    methods: {
        routeTrack() {
            this.$router.push('/track/' + this.track._id);
        },
        routeArtist(index) {
            this.$router.push('/artist/' + this.track.artists[index]._id);
        },
        comma(index, total) {
            if (index < total - 1)
                return ',';
            return '';
        }
    },
};
</script>


<style scoped>
h1 {
    margin: 0 0;
    display: block;
    text-align: left;
    max-width: calc(100%);
    font-size: 1.1em; 
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
}



h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
}

h2:hover {
    text-decoration: underline;
}

.sub-flex {
  max-width: 100%;
  overflow: hidden;
}
</style>