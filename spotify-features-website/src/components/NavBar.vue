<template>
    <div class="NavBar">
        <div id="fixed">
        <div id="logo-div">
            <img id="logo" src="../assets/icons/spotify.svg">
            <h1 id="logo-title">Spotify Features</h1>
        </div>
        <div :class="{active: path == 'home'}" @click="route('')" class="nav-button">
            <img src="../assets/icons/home.svg"/><h1>Home</h1>
            <div class="active-bar"/>
        </div>

        <div v-for="(app, index) in publicApps" :key="app.title" :class="{active: path == app.path}" @click="route(app.path, index)" class="nav-button">
            <img :src="getImgUrl(app.img)"/><h1>{{app.title}}</h1>
            <div class="active-bar"/>
        </div>

        <h3>Your Library</h3>
        <div v-for="(app, index) in privateApps" :key="app.title" :class="{active: path == app.path}" @click="route(app.path, index + publicApps.length)" class="nav-button">
            <img :src="getImgUrl(app.img)"/><h1>{{app.title}}</h1>
            <div class="active-bar"/>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        path: String,
    },
    methods: {
        route(path, index) {
            if (path == this.path)
                return;
            if (path != "")
            {
                this.$store.dispatch("changeIndex", {index: index});
                this.$router.push("/" + path);
            }
            else 
                this.$router.push("/");
        },
        getImgUrl(pic) {
            var images = require.context('../assets/icons', false, /\.svg$/)
            return images('./' + pic + ".svg");
        }
    },
    computed: {
        apps() {
            return this.$store.state.apps;
        },
        publicApps() {
            return this.apps.filter(function(app) {
                return !app.auth;
            });
        },
        privateApps() {
            return this.apps.filter(function(app) {
                return app.auth;
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.NavBar {
    display: block;
    padding-top: 24px;
    overflow-y: auto;
    width: 230px;
    height: 100vh;
}

#fixed {
    display: block;
    padding-top: 24px;
    width: 230px;
    height: 100vh;
    background-color: rgb(18, 18, 18);
    color: rgb(255, 255, 255);
    position: fixed;
    left: 0;
    top: 0;
}

.nav-button {
    position: relative;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0px 24px;
    opacity: .6;
    cursor: pointer;
    margin-bottom: 5px;
    transition: all .4s ease;
}

.active-bar {
    position: absolute;
    height: 30px;
    width: 5px;
    opacity: 0;
    transition: all .4s ease;
    background: rgb(30, 215, 95);
    left: 0px;
    bottom: 4px;
    transition: all .4s ease;
}

.active .active-bar {
    opacity: 1;
}

.nav-button:hover {
    opacity: 1;
}

.nav-button.active {
    opacity: 1;
}

h1 {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .015em;
}

h3 {
    font-size: 11px;
    line-height: 16px;
    color: #b3b3b3;
    text-transform: uppercase;
    letter-spacing: .16em;
    margin: 5px 20px;
    margin-top: 25px;
    text-align: left;
    cursor: default;
}

img {
    display: block;
    height: 24px;
    width: 24px;
    margin-right: 16px;
}

#logo {
    height: 30px;
    width: 30px;
}

#logo-div {
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 0px 20px;
    margin-bottom: 13px;
}

#logo-title {
    font-size: 17px;
}

</style>
