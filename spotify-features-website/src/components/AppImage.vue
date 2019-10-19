<template>
    <div class="AppImage">
        <div :style="{backgroundImage: backgroundGradient, '--width': + width}" id="app-image">
            <img :src="getImgUrl(apps[index].img)"/>
            <h1>{{apps[index].title}}</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppImage',
    props: {
        width: Number,
        index: Number,
    },
    methods: {
        getImgUrl(pic) {
            var images = require.context('../assets/icons', false, /\.svg$/)
            return images('./' + pic + ".svg");
        }
    },
    computed: {
        apps() {
            return this.$store.state.apps;
        },
        backgroundGradient() {
            let color = {red: this.$store.state.apps[this.index].color.red, green: this.$store.state.apps[this.index].color.green, blue: this.$store.state.apps[this.index].color.blue};
            let newColor = {red: color.blue, green: color.green, blue: color.red};
            // radial-gradient(circle at 0px 0px, rgb(107, 111, 167), rgb(59, 63, 125))
            return "radial-gradient(circle at 50% 140%, rgb(" + color.red + "," + color.green + "," + color.blue + ") 0% 20%," + "rgb(" + newColor.red + "," + newColor.green + "," + newColor.blue + "))";
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app-image {
    --width: 0;
    --padding: 20;
    display: block;
    position: relative;
    width: calc(var(--width) * 1px);
    height: calc(var(--width) * 1px);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.61);
}

img {
    display: block;
    position: absolute;
    left: calc(var(--width) * (var(--padding) * 1px) / 285);
    bottom: calc(var(--width) * (var(--padding) * 1px) / 285);
    width: calc(var(--width) * 120px / 285);
    height: calc(var(--width) * 120px / 285);
}

h1 {
    font-family: 'Bitter', serif;
    font-weight: lighter;
    color: white;
    font-size: calc(var(--width) * 30px / 285);
    margin: 0px;
    position: absolute;
    width: 50%;
    top: calc(var(--width) * (var(--padding) * 1px) / 285);
    left: calc(var(--width) * (var(--padding) * 1px) / 285);
    text-align: left;
}

</style>
