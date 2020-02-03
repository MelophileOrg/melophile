<template>
    <div class="Averages window window-limit window-header-active elevation-2">
        <h1 class="window-header">Averages</h1>
        <div class="average flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon tempo-icon"/>
            <h2>Tempo</h2>
            <v-progress-linear height="6" rounded :value="tempoPercent" :color="tempoColor"></v-progress-linear>
            <h3 :style="{color: tempoColor}">{{tempoValue}} BPM</h3>
        </div>
        <div class="average flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon major-icon"/>
            <h2>Major</h2>
            <v-progress-linear height="6" rounded :value="majorPercent" :color="majorColor"></v-progress-linear>
            <h3 :style="{color: majorColor}">{{majorPercent}}%</h3>
        </div>
        <div class="average flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon minor-icon"/>
            <h2>Minor</h2>
            <v-progress-linear height="6" rounded :value="minorPercent" :color="minorColor"></v-progress-linear>
            <h3 :style="{color: minorColor}">{{minorPercent}}%</h3>
        </div>
    </div>
</template>



<script>
export default {
    name: 'Averages',
    props: {
        tempo: Number,
        mode: Number,
    },
    computed: {
        jimmy() {
            return this.$store.state.jimmy;
        },
        audioFeatureData() {
            return this.$store.state.constants.audioFeaturesData;
        },
        tempoPercent() {
            return Math.round((this.tempo / 225) * 100);
        },
        tempoValue() {
            return Math.round(this.tempo);
        },
        tempoColor() {
            return 'rgb(' + this.audioFeatureData.tempo.color.red + ',' + this.audioFeatureData.tempo.color.green + ',' + this.audioFeatureData.tempo.color.blue + ')';
        },
        majorPercent() {
            return Math.round(this.mode * 100);
        },
        majorColor() {
            return 'rgb(' + this.audioFeatureData.major.color.red + ',' + this.audioFeatureData.major.color.green + ',' + this.audioFeatureData.major.color.blue + ')';
        },
        minorPercent() {
            return Math.round(100 - (this.mode * 100));
        },
        minorColor() {
            return 'rgb(' + this.audioFeatureData.minor.color.red + ',' + this.audioFeatureData.minor.color.green + ',' + this.audioFeatureData.minor.color.blue + ')';
        },
    },
    created() {
        console.log('tempo', this.tempo);
        console.log('mode', this.mode);
    }
};
</script>

<style scoped>
.Averages {
    padding: 20px;
    padding-top: 22px;
    width: 31%;
}

@media only screen and (max-width: 875px) {
    .Averages {
        width: 100%;
        margin: 15px 0px;
    }
}


.average {
    margin: 24px 0px;
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
    min-width: 54px;
    flex-shrink: 0;
}

h3 {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    text-align: right;
    margin: 0px;
    margin-left: 12px;
    min-width: 67px;
    flex-shrink: 0;
    margin-top: 1px;
}


</style>
