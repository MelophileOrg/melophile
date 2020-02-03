<template>
    <div class="Spotlights">
        <div class="spotlights-div">
            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window-spotlight width-third">
                <h1 class="spotlight-title">Top Played Tracks</h1>
                <List :items="spotlights.tracks" :type="0" :number="true"/>
            </div>

            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window-spotlight width-third">
                <h1 class="spotlight-title">Top Saved Artists</h1>
                <List :items="spotlights.artists" :type="1" :number="true"/>
            
            </div>

            <v-skeleton-loader v-if="spotlights == null" :width="compSize" height="104" style="margin: 10px 0px;" type="image" dark/>
            <div v-else class="spotlight window-spotlight width-third">
                <h1 class="spotlight-title">Top Saved Genres</h1>
                <List :items="spotlights.genres" :type="4" :number="true"/>

            </div>
        </div>
    </div>
</template>

<script>
import List from '@/components/List/List.vue'

export default {
    name: 'Spotlights',
    components: {
        List
    },
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
        
        console.log(this.spotlights);
    }
};
</script>

<style scoped>
.Spotlights {
    margin: 10px 0px;
}
.img {
    --size: 40;
    display: block;
    background-size: auto 100%;
    background-position: center center;
    width: 20%;
    min-height: 52px;
}

.item-title {
    font-size: 1rem !important;
}

.top {
    padding: 5px;
    background: var(--melophile-brand-2);
    border-radius: 3px;
}

.spotlight h1 {
    color: white;
    font-size: 28px;
    font-weight: lighter;
    width: 100%;
    text-align: left;
    margin-bottom: 15px;
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
}

.window-spotlight {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 12px 12px;
  border-radius: 3px;
  margin-bottom: 15px;
  margin-top: 10px;
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
