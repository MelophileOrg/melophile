<template>
    <div class="TrackHeader pop-small" :class="{background: colors}" :style="{'--red': + red, '--green': + green, '--blue': + blue, '--alpha': + alpha}">
        <div class="track-img" v-if="track != null" :style="{backgroundImage: 'url(\'' + track.image + '\')'}"/>
        <div class="track-img null" v-else/>
        <div class="content">
            <h1 v-if="track != null">{{track.name}}</h1>
            <div v-if="track != null" class="artists">
                <h2 @click="toArtist(artist._id)" v-for="(artist, index) in track.artists" :key="artist._id">{{artist.name}}{{comma(index, track.artists.length)}}</h2>
            </div>
            <v-tabs dense class="menu" :background-color="'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'">
                <v-tabs-slider color="#52e3c2"></v-tabs-slider>
                <v-tab>
                    Overview
                </v-tab>
                <v-tab>
                    Analysis
                </v-tab>
                <v-tab>
                    Compairson
                </v-tab>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import analyze from 'rgbaster';
export default {
    name: 'TrackHeader',  
    props: {
        track: Object,
    },
    data() {
        return {
            tab: 0,
            color: {red: 0, green: 0, blue: 0, alpha: 0},
        }
    },
    methods: {
        changeTab(index) {
            this.tab = index;
            this.$emit('changeTab', this.tab);
        },
        toArtist(id) {
            this.$router.push('/artists/' + id);
        },
        comma(index, length) {
            if (index < length - 1) {
                return ",";
            }
            return "";
        },
        async dominantColor() {
            if (this.trackReady) {
                let result = await analyze(this.trackData.album.images[0].url, {ignore: ['rgb(0,0,0)']});
                let re = RegExp(/\d+/i, 'g');
                this.color.r = parseInt(re.exec(result[0].color), 10);
                this.color.g = parseInt(re.exec(result[0].color), 10);
                this.color.b = parseInt(re.exec(result[0].color), 10);
                this.color.a = .2;
            }
        },
    },
    computed: {
        colors() {
            if (this.trackReady) {
                this.dominantColor();
                return true;
            }
            return false;
        },
        red() {
            return this.color.red;
        },
        green() {
            return this.color.green;
        },
        blue() {
            return this.color.blue;
        },
        alpha() {
            return this.color.alpha;
        }
    }
};
</script>


<style scoped>
.TrackHeader {
    display: flex;
    width: 100%;
    min-height: 80px;
    transition: all .5s ease;
    background: rgba(255, 255, 255, 0.05);
    position: relative;
}

.track-img {
    display: block;
    width: 140px;
    height: 140px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
}

.track-img.null {
    background-image: linear-gradient(rgba(46, 46, 46, 0.541), rgba(90, 90, 90, 0.541), rgba(46, 46, 46, 0.541));
    background-repeat: repeat;
    background-size: 100% 100%;
    animation: background-cycle 1s linear 0s infinite;
}

.TrackHeader.background {
    --red: 255;
    --green: 255;
    --blue: 255;
    --alpha: 0;
    background: rgba(var(--red), var(--green), var(--blue), var(--alpha));
}

.content {
    display: block;
    width: calc(100% - 140px);
    height: calc(140px - 0px);
    padding: 0px;
    padding-bottom: 0px;
    position: relative;
}

h1 {
    font-family: 'Roboto', sans-serif;
    color: rgba(255, 255, 255, 0.89);
    font-weight: lighter;
    text-align: left;
    margin: 20px;
    margin-bottom: 0px;
    font-size: 1.7em;
}

h2 {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.726);
  font-weight: lighter;
  text-align: left;
  font-size: 1em;
  margin-left: 20px;
  margin-top: 0px;
  cursor: pointer;
  margin-right: 10px;
}

h2:hover {
    text-decoration: underline;
}
.menu {
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
}

.menu button {
  font-family: 'Roboto', sans-serif;
  color: rgba(255, 255, 255, 0.767);
  font-weight: lighter;
  font-size: 1em;
  background: rgba(255, 255, 255, 0);
  border: 0px;
  border-bottom: 3px solid rgba(40, 180, 40, 0);
  transition: all .3s ease;
  max-width: 150px;
  width: 50vw;
  padding: 5px 0px;
}

.menu button:hover {
  background: rgba(255, 255, 255, 0.075);
}

.menu button.active {
  border-bottom: 3px solid #1ed75f;
}

.artists {
    display: flex;
    flex-wrap: wrap;
    max-width: 100vw;
    margin-top: 5px;
}

@media screen and (max-width: 720px) {
    .TrackHeader {
        width: 100vw !important;
        height: 100vw !important;
    }

    .track-img {
        position: absolute;
        background-size: 100% auto;
        background-position: center center;
        left: 0px;
        top: 0px;
        opacity: .25;
        width: 100vw;
        height: 100vw;
    }

    .content {
        width: 100%;
        height: calc(100vw);
    }

    h1 {
        color: rgba(255, 255, 255, 0.952);
        text-align: center;
        font-size: 2em;
        margin-top: 20vw;
    }

    h2 {
        color: white;
        text-align: center;
    }
    .menu {
        left: 0px !important;
        width: 100vw;
        justify-content: center;
        bottom: -50px;
    }
    
    .menu button {
        width: 30%;
    }

    .artists {
        display: flex;
        justify-content: center;
    }

    .TrackHeader.background {
      --red: 255;
      --green: 255;
      --blue: 255;
      --alpha: 0;
      background: rgba(var(--red), var(--green), var(--blue), 0);
    }
}
</style>