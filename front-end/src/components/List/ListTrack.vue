<template>
  <div class="ListTrack">
        <div>
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
    }),
    methods: {
    },
    computed: {
        tracks() {
            return this.$store.state.data.list.tracks;
        },
    },
    async created() {
        console.log(this.tracks);
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