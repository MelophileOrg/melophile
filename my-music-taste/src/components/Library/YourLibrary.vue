<template>
    <div class="YourLibrary" :style="{'--delay': + 0}">
        <h3 class="window-title" v-if="progress.tracksLoaded">Your Library:</h3>
        <div v-if="progress.tracksLoaded" class="row flex-space-between">
        <h4 class="light">Saved Songs</h4><h4 class="num">{{formatNumber(total)}}</h4>
        </div>
        <div v-if="progress.artistsLoaded" class="row flex-space-between">
        <h4 class="light">Artists</h4><h4 class="num">{{formatNumber(Object.keys(artists).length)}}</h4>
        </div>
        <div v-if="progress.genresLoaded" class="row flex-space-between">
        <h4 class="light">Genres</h4><h4 class="num">{{formatNumber(Object.keys(genres).length)}}</h4>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YourLibrary',
    props: {
        delay: Number,
    },
    methods: {
        formatNumber(num) {
            let thousands = Math.floor(num / 1000);
            let remainder = num % 1000;
            let zeros = "";
            if (remainder < 100)
                zeros += "0"
            if (remainder < 10)
                zeros += "0"
            if (thousands > 0) 
                return thousands + "," + zeros + remainder;
            return remainder;
        },
    },
    computed: {
        total() {
            return this.$store.state.progress.total;
        },
        progress() {
            return this.$store.state.progress;
        },
        artists() {
            return this.$store.state.artists;
        },
        genres() {
            return this.$store.state.genres;
        },
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.YourLibrary {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 22px 22px;
    padding: 20px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
}


.row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

@media screen and (max-width: 720px) {
    h4 {
        font-size: 1.1em !important;
    }
}

.light {
  color: rgba(255, 255, 255, 0.514) !important;
  font-size: 1.4em;
  margin-bottom: 2px;
}

.num {
  margin-right: 5px;
  font-size: 1.8em;
}

</style>