<template>
    <div class="ListTrack">
        <div v-if="track == null">
        </div>
        <div v-else class="flex">
            <div class="img" :style="{backgroundImage: 'url(' + track.image + ')'}"/>
            <h1>{{track.name}}</h1>
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
    }),
    methods: {
    },
    computed: {
        track() {
            return this.$store.state.list.tracks[this.id];
        },
    },
    created() {
        console.log(this.track);
    }
};
</script>


<style scoped>
.ListTrack {
    display: flex;

    width: 100%;
    padding: 2px;
    background-color: rgba(255, 255, 255, 0.068);
    margin: 5px auto;
    width: 80%;
}

.img {
    display: block;
    width: 50px;
    height: 50px;
    background-size: 100% 100%;
    background-position: center center;
    margin-right: 10px;
}

h1 {
   display: inline-block;
   font-size: 1em; 
}
</style>