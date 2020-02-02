<template>
    <div class="Probabilities window window-limit elevation-1">
        <h1 class="window-title">Likelyhood a song is:</h1>
        <h2>Instrumental</h2>
        <v-progress-linear height="8" rounded :value="instrumentalnessPercent" :color="instrumentalnessColor"></v-progress-linear>
        <h2>Acoustic</h2>
        <v-progress-linear height="8" rounded :value="acousticnessPercent" :color="acousticnessColor"></v-progress-linear>
        <h2>Live</h2>
        <v-progress-linear height="8" rounded :value="livenessPercent" :color="livenessColor"></v-progress-linear>
    </div>
</template>

<script>
export default {
    name: 'Probabilities',
    props: {
        instrumentalness: Number,
        acousticness: Number,
        liveness: Number,
    },
    computed: {
        jimmy() {
            return this.$store.state.jimmy;
        },
        audioFeatureData() {
            return this.$store.state.constants.audioFeaturesData;
        },
        instrumentalnessPercent() {
            return Math.round(this.instrumentalness * 100);
        },
        instrumentalnessColor() {
            return 'rgb(' + this.audioFeatureData.instrumentalness.color.red + ',' + this.audioFeatureData.instrumentalness.color.green + ',' + this.audioFeatureData.instrumentalness.color.blue + ')';
        },
        acousticnessPercent() {
            return Math.round(this.acousticness * 100);
        },
        acousticnessColor() {
            return 'rgb(' + this.audioFeatureData.acousticness.color.red + ',' + this.audioFeatureData.acousticness.color.green + ',' + this.audioFeatureData.acousticness.color.blue + ')';
        },
        livenessPercent() {
            return Math.round(this.liveness * 100);
        },
        livenessColor() {
            return 'rgb(' + this.audioFeatureData.liveness.color.red + ',' + this.audioFeatureData.liveness.color.green + ',' + this.audioFeatureData.liveness.color.blue + ')';
        },
    },
    created() {
        console.log('instrumentalness', this.instrumentalness);
        console.log('liveness', this.liveness);
        console.log('acousticness', this.acousticness);
    }
};
</script>

<style scoped>
.Probabilities {
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
