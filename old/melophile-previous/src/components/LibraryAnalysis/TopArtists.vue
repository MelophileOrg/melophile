<template>
    <div class="TopArtists window window-limit window-header-active elevation-2">
        <h1 class="window-header">Favorite Artist</h1>
        
    </div>
</template>

<script>
export default {
    name: 'TopArtists',
    components: {
    }, 
    props: {
        artists: Array
    },
    computed: {
    }
};
</script>

<style scoped>
.TopArtists {
    padding: 15px 20px;
    width: 31%;
    max-height: 304px;
    overflow: auto;
}

@media only screen and (max-width: 875px) {
    .TopArtists {
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


