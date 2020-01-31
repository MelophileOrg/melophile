<template>
    <div class="Spotlights">
        <div class="spotlights-div">
            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window width-third elevation-1">
                <h1 class="spotlight-title">Top Played Tracks</h1>

                
            </div>
            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window width-third elevation-1">
                 <h1 class="spotlight-title">Top Saved Artists</h1>

                
            </div>
            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window width-third elevation-1">
                 <h1 class="spotlight-title">Top Saved Genres</h1>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Spotlights',
    data: () => ({
        spotlights: null,
    }),
    methods: {
        formatNumber(val) {
        if (val == null) return "0";
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    computed: {
        jimmy() {
            return this.$store.state.jimmy;
        },
        compSize() {
            let diff = 225 + 32;
            if (window.innerWidth < 1264) diff = 32;
            let x = window.innerWidth - diff;
            if (window.innerWidth < 1264) return x;
            return (x / 3) - 32;
        }
    },
    async created() {
        this.spotlights = await this.jimmy.getSpotlights();
        console.log(this.spotlights);
    }
};
</script>

<style scoped>
.spotlight h1 {
    color: rgba(255, 255, 255, 0.877);
    font-size: 22px;
    font-weight: lighter;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
}

.spotlight {
    min-width: 280px;
}

.spotlights-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}

.width-third {
    width: 31%;
    display: flex;
    justify-content: center;
}



@media only screen and (max-width: 875px) {
    .width-third {
        width: 100%;
        margin: 5px 0px;
    }
    .spotlights-div {
        justify-content: space-around;
    }
}
</style>
