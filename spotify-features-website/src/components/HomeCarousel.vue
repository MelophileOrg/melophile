<template>
    <div class="HomeCarousel">
        <h1 class="carousel-title">{{title}}</h1>
        <button class="left" @click="flip(false)"/>
        <button class="right" @click="flip(false)"/>
        <div class="window current" :style="{'--red': apps[index[0]].color.red, '--green': apps[index[0]].color.green, '--blue': apps[index[0]].color.blue}" :class="{slidein: transition}">
            
            <div class="flex">
                <div class="title">
                    <img :src="getImgUrl(apps[index[0]].img)"/>
                    <h1>{{apps[index[0]].title}}</h1>
                </div>
            </div>
            <div class="description">
                <h2>Description</h2>
                <p v-for="(line, index) in apps[index[0]].description" :key="'description' + index">{{line}}</p>
                <button class="launch" @click="route(apps[index[0]].path)">Launch</button>
            </div>
        </div>
        <div class="window old" :style="{'--red': apps[index[1]].color.red, '--green': apps[index[1]].color.green, '--blue': apps[index[1]].color.blue}" :class="{slideout: transition}">
            <div class="flex">
                <div class="title">
                    <img :src="getImgUrl(apps[index[1]].img)"/>
                    <h1>{{apps[index[1]].title}}</h1>
                </div>
            </div>
            <div class="description">
                <h2>Description</h2>
                <p v-for="(line, index) in apps[index[1]].description" :key="'description' + index">{{line}}</p>
                <button class="launch" @click="route(apps[index[1]].path)">Launch</button>
            </div>
        </div>
    </div>
</template>

<script>
import AppTitle from '@/components/AppTitle.vue'

export default {
    name: 'HomeCarousel',
    props: {
        apps: Array,
        title: String,
    },
    components: {
        AppTitle
    },
    data() {
        return {
            index: [0, 1],
            interval: null,
            transition: false,
        }
    },
    methods: {
        flip(direction) {
            this.index[1] = this.index[0];
            let newIndex = this.index[0];
            if (direction)
                newIndex += 1;
            if (!direction)
                newIndex -= 1;
            if (newIndex > this.apps.length - 1)
                newIndex = 0;
            if (newIndex < 0)
                newIndex = this.apps.length - 1;
            this.index[0] = newIndex;
            this.transition = true;
            this.interval = setInterval(this.animate, 800);
        },
        animate() {
            this.transition = false;
        },
        getImgUrl(pic) {
            var images = require.context('../assets/icons', false, /\.svg$/)
            return images('./' + pic + ".svg");
        },
        route(path) {
            this.$store.dispatch("changeIndex", {index: 0});
            this.$router.push("/" + path);
        },

    },
    computed: {
    },
    created() {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.HomeCarousel {
    display: block;
    width: calc(100%);
    position: relative;
    height: calc(50vh);
    max-height: 90vh;
}

.window {
    --red: 0;
    --green: 0;
    --blue: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-image: radial-gradient(circle at center 140%, rgb(var(--red), var(--green), var(--blue)), rgb(var(--blue), var(--green), var(--red)));
    background-size: 100% 150%;
    background-position: center 100%;
}


.flex {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    margin-left: 32px;
    padding-top: 40px;
    min-width: 502px;
    max-width: 650px;
    max-height: 100px;
}

.title {
    display: flex;
    justify-content: left;
    align-items: center;
}

.description {
    width: 40%;
    margin: 0 auto;
    padding-top: 0px;
    min-width: 370px;
}
@import url('https://fonts.googleapis.com/css?family=Archivo+Black&display=swap');

.launch {
    padding: 10px 30px;
    margin-top: 20px;
    font-size: 20px;
    font-weight: bolder;
    background-color: rgba(255, 255, 255, 0.329);
    color: rgb(255, 255, 255);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.521);
    transition: all .3s ease;
}

button:hover {
    background-color: rgba(255, 255, 255, 0.555);
}

h2 {
    color: rgba(255, 255, 255, 0.452);
    font-size: 1em;
    text-align: left;
    text-transform: uppercase;
    font-weight: bolder;
    font-family: 'Archivo Black', sans-serif;
    margin: 10px 0;
    margin-top: 30px;
}

p {
    text-align: left;
    color: white;
    font-size: 20px;
    line-height: 35px;
}

.title {
    padding-top: 1%;
}

.current {
    width: 100%;
    height: 100%;
}

h1 {
    font-size: 60px;
    color: white;
}

.carousel-title {
    display: block;
    position: absolute;
    margin: 0;
    font-size: 35px;
    left: 32px;
    top: 30px;
}

img {
    width: 70px;
    margin-right: 20px;
    height: 70px;
}

.old {
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    display: none !important;
}

.slidein {
    display: flex;
    animation: slide-in .8s ease-in-out;
}

.slideout {
    animation: slide-out .8s ease-in-out;
}

@keyframes slide-out {
    to {
        transform: translateX(-100%);
    }
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
    }
}
</style>
