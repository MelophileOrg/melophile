<template>
    <div class="navbutton" :class="{active: active, inactive: !active}">
        <div class="green-bar" />
        <div @click="route()" class="button-contents">
            <img :src="getImgUrl(image)"/>
            <h1>{{title}}</h1>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'navbutton',
    props: {
        image: String,
        title: String,
        active: Boolean,
        path: String,
    },
    data() {
        return {
            currPath: this.$router.currentRoute.name
        }
    },
    methods: {
        getImgUrl(pic) {
            var images = require.context('../../assets/icons', false, /\.svg$/)
            return images('./' + pic + ".svg");
        },
        route() {
            if (this.path == this.currPath)
                return;
            this.$router.push({name: this.path});
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbutton {
    display: block;
    width: 100%;
    position: relative;
    cursor: pointer;
    opacity: .6;
    transition: all .3s ease;
    margin: 0px 0px;
    height: 42px;
}

.navbutton:hover {
    opacity: 1;
}

.navbutton.active {
    opacity: 1;
}

.button-contents {
    display: flex;
    align-items: center;
    width: calc(100% - 70px);
    height: 100%;
    padding: 0px 35px;
}

.inactive .green-bar {
    opacity: 0;
}

.active .green-bar {
    display: block;
    width: 5px;
    height: 100%;
    background: #1ed75f;
    position: absolute;
    left: 0px;
    top: 0px;
}

img {
    width: 24px;
    height: 24px;
    margin-right: 16px;
}

h1 {
    font-size: 14px;
    letter-spacing: .015em;
}
</style>