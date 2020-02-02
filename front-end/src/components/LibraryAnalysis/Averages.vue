<template>
    <div class="Averages window window-limit elevation-1">
        <h1 class="window-title">Average:</h1>
        <h2>Tempo</h2>
        <v-progress-linear height="8" rounded :value="tempoPercent" :color="tempoColor"></v-progress-linear>
        <h2>Major</h2>
        <v-progress-linear height="8" rounded :value="majorPercent" :color="majorColor"></v-progress-linear>
        <h2>Minor</h2>
        <v-progress-linear height="8" rounded :value="minorPercent" :color="minorColor"></v-progress-linear>
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
    padding: 10px 15px;
    padding-bottom: 30px;
}

h2 {
    color: rgba(255, 255, 255, 0.897);
    font-size: 1.1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
    text-align: left;
    opacity: 1;
    margin: 0px;
    margin-bottom: 5px;
    margin-top: 15px;
}

</style>
