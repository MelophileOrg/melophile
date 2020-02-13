<template>
    <div class="Header elevation-3" :class="{background: colors}" :style="{'--red': + red, '--green': + green, '--blue': + blue}">
        <div class="large-img" :style="{backgroundImage: image ? 'url(' + image + ')' : 'url(../../assets/placeholders/logo.svg)'}"></div>
        <div class="img" :style="{backgroundImage: image ? 'url(' + image + ')' : 'url(../../assets/placeholders/logo.svg)'}"></div>
        <div class="details">
            <h1 v-if="title != null">{{title}}</h1>
            <div v-if="secondaries" class="secondaries">
                <h2 @click="toSecondary(item.id)" v-for="(item, index) in secondaries" :key="item.id">{{item.name + comma(index, secondaries.length)}}</h2>
            </div>
            <h2 v-else @click="toSecondary(item.id)">{{secondary}}</h2>
            <v-tabs id="bottom" background-color="rgba(0,0,0,0)">
                <v-tab v-for="tab in tabs" :key="tab.text" @click="changeTab(tab.value)">{{tab.text}}</v-tab>
            </v-tabs>
        </div>

    </div>
</template>

<script>
import analyze from 'rgbaster';

export default {
    name: 'Header',  
    props: {
        title: String,
        secondary: String,
        secondaries: Array,
        image: String,
        type: String,
    },
    data() {
        return {
            tab: 0,
            color: {red: 50, green: 50, blue: 50},
        }
    },
    methods: {
        changeTab(index) {
            this.tab = index;
            this.$emit('changeTab', this.tab);
        },
        toSecondary(id) {
            if (this.type == "track")
                this.$router.push('/artist/' + id);
            else if (this.type == "artist")
                this.$router.push('/genre/' + id);
        },
        comma(index, length) {
            if (index < length - 1) {
                return ",";
            }
            return "";
        },
        async dominantColor() {
            if (this.image != null) {
                let result = await analyze(this.image, {scale: .1, ignore: ['rgb(0,0,0)', 'rgb(255,255,255)']});
                let re = RegExp(/\d+/i, 'g');
                this.color.red = parseInt(re.exec(result[0].color), 10);
                this.color.green = parseInt(re.exec(result[0].color), 10);
                this.color.blue = parseInt(re.exec(result[0].color), 10);
                console.log(this.color);
            }
        },
    },
    computed: {
        colors() {
            if (this.image != null) {
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
        tabs() {
            if (this.type == null) {
                return [];
            } else if (this.type == "track") {
                return [{text: "Overview", value: 0}, {text: "Analysis", value: 1}, {text: "Comparison", value: 2}];
            } else if (this.type == "artist") {
                return [{text: "Overview", value: 0}, {text: "Relationship", value: 1}, {text: "History", value: 2}, {text: "Liked Tracks", value: 3}];
            } else if (this.type == "playlist") {
                return [{text: "Overview", value: 0}, {text: "Tracks", value: 1}];
            } else if (this.type == "genre") {
                return [{text: "Overview", value: 0}, {text: "Liked Tracks", value: 1}, {text: "Liked Artists", value: 2}];
            } else {
                return [];
            }
        }
    }
};
</script>


<style scoped>
.Header {
    --red: 50;
    --green: 50;
    --blue: 50;
    background-color: rgba(var(--red), var(--green), var(--blue), .1);
    width: 100%;
    height: 140px;
    display: flex;
    position: relative;
}

.img {
    display: block;
    background-size: 100% auto;
    height: 140px;
    width: 140px;
}

.large-img {
    display: none;
}

.details {
    width: calc(100% - 140px);
}

h1 {
    text-align: left;
    font-weight: lighter;
    font-size: 1.5rem;
    margin: 12px;
    margin-left: 20px;
    margin-bottom: 0px;
}

.secondaries {
    display: flex;
    margin-left: 20px;
    width: calc(100% - 180px);
    overflow: auto;
}

h2 {
    color: rgb(146, 146, 146);
    text-align: left;
    font-weight: lighter;
    font-size: 1.2rem;
    margin-right: 12px;
    margin-top: 6px;
    white-space: nowrap;
}

h2:hover {
    color: rgb(219, 219, 219);
    text-decoration: underline;
    cursor: pointer;
}

#bottom {
    position: absolute;
    bottom: 0;
}

.v-tabs {
    margin-left: 20px;
}

@media screen and (max-width: 720px) {
    .Header {
        width: 100vw;
        height: 100vw;
        display: flex;
        align-items: center;
    }

    .img {
        display: none;
    }

    .details {
        width: 100%;
    }

    h1 {
        text-align: center;
    }

    h2 {
        text-align: center;
    }

    .secondaries {
        justify-content: center;
    }

    .large-img {
        display: block;
        background-size: 100% auto;
        position: absolute;
        top: 0; left: 0;
        bottom: 0; right: 0;
        opacity: .3;
        z-index: -10;
    }

    v-tabs {
        margin: 0px;
    }

}



</style>