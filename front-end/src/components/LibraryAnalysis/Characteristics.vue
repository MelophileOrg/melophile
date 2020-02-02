<template>
    <div class="Characteristics window window-limit elevation-1">
        <div class="characteristic flex flex-space-around flex-align-center">
            <div :style="{'--size': + 35}" class="icon valence-icon"/>
            <h2>Happiness</h2>
            <v-progress-linear height="10" rounded :value="valencePercent" :color="valenceColor"></v-progress-linear>
        </div>
        <div class="characteristic flex flex-space-around flex-align-center">
            <div :style="{'--size': + 35}" class="icon danceability-icon"/>
            <h2>Danceability</h2>
            <v-progress-linear height="10" rounded :value="danceabilityPercent" :color="danceabilityColor"></v-progress-linear>
        </div>
        <div class="characteristic flex flex-space-around flex-align-center">
            <div :style="{'--size': + 35}" class="icon energy-icon"/>
            <h2>Energy</h2>
            <v-progress-linear height="10" rounded :value="energyPercent" :color="energyColor"></v-progress-linear>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Characteristics',
    props: {
        valence: Number,
        danceability: Number,
        energy: Number,
    },
    computed: {
        jimmy() {
            return this.$store.state.jimmy;
        },
        audioFeatureData() {
            return this.$store.state.constants.audioFeaturesData;
        },
        valencePercent() {
            return Math.round(this.valence * 100);
        },
        valenceColor() {
            return 'rgb(' + this.audioFeatureData.valence.color.red + ',' + this.audioFeatureData.valence.color.green + ',' + this.audioFeatureData.valence.color.blue + ')';
        },
        danceabilityPercent() {
            return Math.round(this.danceability * 100);
        },
        danceabilityColor() {
            return 'rgb(' + this.audioFeatureData.danceability.color.red + ',' + this.audioFeatureData.danceability.color.green + ',' + this.audioFeatureData.danceability.color.blue + ')';
        },
        energyPercent() {
            return Math.round(this.energy * 100);
        },
        energyColor() {
            return 'rgb(' + this.audioFeatureData.energy.color.red + ',' + this.audioFeatureData.energy.color.green + ',' + this.audioFeatureData.energy.color.blue + ')';
        },
    },
    created() {
        console.log('valence', this.valence);
        console.log('energy', this.energy);
        console.log('danceability', this.danceability);
    }
};
</script>

<style scoped>
.Characteristics {
    padding: 10px 15px;
    padding-bottom: 30px;
}

.characteristic {
    margin-bottom: 10px;
}

.icon {
    opacity: .5;
    margin-right: 5px;
}

h2 {
    color: rgba(255, 255, 255, 0.897);
    font-size: 1.3rem;
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
    text-align: left;
    opacity: 1;
    margin: 0px;
    margin-right: 12px;
    min-width: 110px;
    flex-shrink: 0;
}

.v-progress-bar {

}

</style>


