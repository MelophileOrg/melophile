<template>
    <div class="AppCarousel">
        <div v-for="(app, index) in apps" :key="'carousel-'+app.title+'-'+index " class="app">
            <h1>{{app.title}}</h1>
        </div>
    </div>
</template>

<script>

export default {
    name: 'AppCarousel',
    props: {
        apps: Array,
    },
    components: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.AppCarousel {
    display: flex;
    width: calc(100% - (64px * 2));
    overflow-x: auto;
    margin: 0 auto;
}

.app {
    margin: 0 32px;
    cursor: pointer;
}

h1 {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .015em;
    color: white;
    margin-top: 12px;
}



</style>