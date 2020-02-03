<template>
    <div class="TopTracks window window-limit window-header-active elevation-2">
        <h1 class="window-header">Favorite Tracks</h1>
        <v-carousel height="169" show-arrows-on-hover hide-delimiters>
            <v-carousel-item v-for="item in tracks" :key="'top-tracks' + item._id" >
                <div class="flex flex-center flex-align-center">
                    <div class="img" :style="{backgroundImage: 'url(' + item.image + ')'}"/>
                    <h1 class="item-title">{{item.name}}</h1>
                </div>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>

<script>

export default {
    name: 'TopTracks',
    components: {

    },  
    props: {
        tracks: Array
    },
    computed: {
    }
};
</script>

<style scoped>
.TopTracks {
    padding: 5px 5px;
    width: 31%;
    max-height: 304px;
    overflow: auto;
}

.img {
    display: block;
    width: 100px; 
    height: 100px;
    background-size: 100% 100%;
    margin: 0px;
}
.item-title {
    font-size: 20px;
    display: inline-block;
}

@media only screen and (max-width: 875px) {
    .TopTracks {
        width: 100%;
        margin: 15px 0px;
    }
}

.icon {
    opacity: .3;
    margin-right: 10px;
}

h2 {
    color: rgba(255, 255, 255, 0.897);
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
    text-align: left;
    opacity: 1;
    margin: 0px;
    margin-right: 12px;
    min-width: 100px;
    flex-shrink: 0;
}

h3 {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    text-align: right;
    margin: 0px;
    margin-left: 12px;
    min-width: 43px;
    flex-shrink: 0;
    margin-top: 1px;
}


</style>


