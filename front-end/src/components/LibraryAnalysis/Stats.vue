<template>
  <div class="Stats">
    <div class="stats-div">
        <v-skeleton-loader v-if="userStats == null" :width="compSize" height="70" style="margin: 10px 0px;" type="image" dark/>
        <div v-else class="stat window width-third elevation-1">
            <v-icon color="#52e3c2" size="30" style="marginRight: 10px">mdi-music-box-outline</v-icon>
            <h1>{{formatNumber(userStats.track_num)}} Tracks</h1>
        </div>
        <v-skeleton-loader v-if="userStats == null" :width="compSize" height="70" style="margin: 10px 0px;" type="image" dark/>
        <div v-else class="stat window width-third elevation-1">
            <v-icon color="#52e3c2" size="30" style="marginRight: 10px">mdi-account-box-outline</v-icon>
            <h1>{{formatNumber(userStats.artist_num)}} Artists</h1>
        </div>
        <v-skeleton-loader v-if="userStats == null" :width="compSize" height="70" style="margin: 10px 0px;" type="image" dark/>
        <div v-else class="stat window width-third elevation-1">
            <v-icon color="#52e3c2" size="30" style="marginRight: 10px">mdi-library-music-outline</v-icon>
            <h1>{{formatNumber(userStats.genre_num)}} Genres</h1>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Stats',
    data: () => ({
        userStats: null,
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
        this.userStats = await this.jimmy.getStats();
    }
};
</script>

<style scoped>
.stat h1 {
  font-weight: lighter;
  color: #52e3c2;
  font-size: 1.8rem;
}

.stat {
  min-width: 280px;
}

.stats-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}

.width-third {
  width: 31%;
  height: 70px;
  align-items: center;
  display: flex;
  justify-content: center;
}


@media only screen and (max-width: 875px) {
    .width-third {
        width: 100%;
        margin: 5px 0px;
    }
    .stats-div {
        justify-content: space-around;
    }
}
</style>
