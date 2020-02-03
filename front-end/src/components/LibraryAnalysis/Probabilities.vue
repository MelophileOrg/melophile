<template>
    <div class="Probabilities window window-limit window-header-active elevation-2">
        <h1 class="window-header">Likelyhood a song is...</h1>
        <div class="probability flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon instrumentalness-icon"/>
            <h2>Instrumental</h2>
            <v-progress-linear height="6" rounded :value="instrumentalnessPercent" :color="instrumentalnessColor"></v-progress-linear>
            <h3 :style="{color: instrumentalnessColor}">{{instrumentalnessPercent}}%</h3>
        </div>
        <div class="probability flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon acousticness-icon"/>
            <h2>Acoustic</h2>
            <v-progress-linear height="6" rounded :value="acousticnessPercent" :color="acousticnessColor"></v-progress-linear>
            <h3 :style="{color: acousticnessColor}">{{acousticnessPercent}}%</h3>
        </div>
        <div class="probability flex flex-space-around flex-align-center">
            <div :style="{'--size': + 25}" class="icon liveness-icon"/>
            <h2>Live Recording</h2>
            <v-progress-linear height="6" rounded :value="livenessPercent" :color="livenessColor"></v-progress-linear>
            <h3 :style="{color: livenessColor}">{{livenessPercent}}%</h3>
        </div>
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
    padding: 20px;
    padding-top: 22px;
    width: 31%;
}

@media only screen and (max-width: 875px) {
    .Probabilities {
        width: 100%;
        margin: 15px 0px;
    }
}


.probability {
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
    min-width: 111px;
    flex-shrink: 0;
}

h3 {
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    text-align: right;
    margin: 0px;
    margin-left: 12px;
    min-width: 43px;
    flex-shrink: 0;
    margin-top: 1px;
}


</style>
