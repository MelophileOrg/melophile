<template>
  <div class="Stats">
    <div class="stats-div">
        <div class="stat window elevation-2">
            <v-icon color="#52e3c2" size="24" style="marginRight: 15px">mdi-music-box-outline</v-icon>
            <h1 v-if="stats != null">{{formatNumber(stats.track_num)}} Tracks</h1>
        </div>
        <div class="stat window elevation-2">
            <v-icon color="#52e3c2" size="24" style="marginRight: 15px">mdi-account-box-outline</v-icon>
            <h1 v-if="stats != null">{{formatNumber(stats.artist_num)}} Artists</h1>
        </div>
        <div class="stat window elevation-2">
            <v-icon color="#52e3c2" size="24" style="marginRight: 15px">mdi-library-music-outline</v-icon>
            <h1 v-if="stats != null">{{formatNumber(stats.genre_num)}} Genres</h1>
        </div>
        <div class="stat window elevation-2">
            <v-icon color="#52e3c2" size="24" style="marginRight: 15px">mdi-library-music-outline</v-icon>
            <h1 v-if="stats != null">{{formatNumber(stats.playlist_num)}} Playlists</h1>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Stats',
    props: {
        stats: Object,
    },
    methods: {
        formatNumber(val) {
            if (val == null) return "0";
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
};
</script>

<style scoped>
.stats-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}

.stat {
    width: 24%;
    height: 70px;
    min-width: 205px;
    align-items: center;
    display: flex;
    justify-content: center;
}

.stat h1 {
  font-weight: lighter;
  color: #52e3c2;
  font-size: 1.5rem;
}

@media only screen and (max-width: 875px) {
    .stat {
        width: 100%;
        margin: 5px 0px;
    }
    .stats-div {
        justify-content: space-around;
    }
}
</style>
