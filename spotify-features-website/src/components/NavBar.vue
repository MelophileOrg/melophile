<template>
    <div class="NavBar">
        <div v-if="w >= 720" class="fixed">
            <div id="logo-div">
                <img id="logo" src="../assets/icons/logo.svg">
                <h1 id="logo-title">My Music Taste</h1>
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
        <div v-if="w < 720" class="fixed small">
            <div id="logo-div" class="small">
                <img id="logo" src="../assets/icons/logo.svg">
                <h1>My Music Taste</h1>
            </div>
            <button @click="toggleMenu"></button>
            <div id="menu-mobile" v-if="menuShow">
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
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        path: String,
    },
    data() {
        return {
            w: 1000,
            interval: null,
            menuShow: false,
        }
    },
    methods: {
        toggleMenu() {
            this.menuShow = !this.menuShow;
        },
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
        },
        getWindowWidth() {
            if (this.$router.currentRoute.name != this.path)
            {
                clearInterval(this.interval);
            }
            this.w = window.innerWidth;
        },
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
    },
    created() {
        this.interval = setInterval(this.getWindowWidth, 100);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#menu-mobile h3 {
    font-size: 1.4em;
}
.NavBar {
    display: block;
    overflow-y: auto;
    width: 100vw;
    height: 100px;
}


@media screen and (min-width: 720px) {
  .NavBar {
    width: 245px;
    padding-top: 24px;
    height: 100vh;
    z-index: 999;
    position: relative;
  }

  .fixed {
    display: block !important;
    padding: 0px 0px;
    padding-top: 24px !important;
    width: 230px !important;
    height: 100vh !important;
  }
}

@media screen and (min-width: 484px) {
    .small h1 {
        font-size: 40px !important;
        line-height: 30px !important;
        margin-top: 30px !important;
    }

    .small button {
        width: 50px !important;
        height: 50px !important;
        margin-top: 30px !important;
        margin-top: calc(50px / 2 - 5px) !important;
    }

}

.small h1 {
    font-size: 20px;
    margin-top: 15px;
    line-height: 25px;
    color: rgb(255, 255, 255);
    
}

#menu-mobile h1 {
    font-size: 30px;
}
.small button {
    display: block;
    width: 40px;
    height: 40px;
    margin-top: calc(60px / 2 - 5px);
    border: 0;
    background-image: url('../assets/icons/menu.svg');
    background-size: 100% 100%;
    background-color:rgba(18, 18, 18,0);
}

.fixed {
    display: flex;
    justify-content: space-between;
    width: calc(100vw - 45px);
    height: 100px;
    z-index: 999;
    padding: 0px 20px;
    padding-left: 10px;
    background-color: rgb(18, 18, 18);
    color: rgb(255, 255, 255);
    position: fixed;
    left: 0;
    top: 0;
}

#menu-mobile {
    display: block;
    position: fixed;
    width: 100vw;
    height: calc(100vh - 100px);
    top: 100px;
    left: 0px;
    z-index: 999;
    transform: translate(0px, 0px);
    background: black;
    overflow: auto;
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

.small #logo {
    margin-right: 15px;
}

#logo {
    height: 32px;
    width: 32px;
    margin-right: 8px;
}

#logo-div {
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 0px 20px;
    margin-bottom: 13px;
}

#logo-title {
    font-size: 18px;
}

</style>
