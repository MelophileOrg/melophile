<template>
    <div class="YourLibrary window" :style="{'--delay': + 0}">
        <h3 class="window-title" v-if="progress.tracksLoaded || profile">{{title}}:</h3>
        <div v-if="progress.tracksLoaded || profile" class="row flex-space-between">
            <h4 class="light">Saved Songs</h4><h4 class="num">{{formatNumber(total)}}</h4>
        </div>
        <div v-if="progress.artistsLoaded || profile" class="row flex-space-between">
            <h4 class="light" v-if="!profile">Artists</h4><h4 v-if="!profile" class="num">{{formatNumber(Object.keys(artists).length)}}</h4>
            <h4 class="light" v-if="profile">Artists</h4><h4 v-if="profile" class="num">{{formatNumber(artists)}}</h4>
        </div>
        <div v-if="progress.genresLoaded || profile" class="row flex-space-between">
            <h4 class="light" v-if="!profile">Genres</h4><h4  v-if="!profile" class="num">{{formatNumber(Object.keys(genres).length)}}</h4>
            <h4 class="light" v-if="profile">Genres</h4><h4 v-if="profile" class="num">{{formatNumber(genres)}}</h4>
        </div>
        <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
    </div>
</template>

<script>
export default {
    name: 'YourLibrary',
    props: {
        delay: Number,
        save: Boolean,
        title: String,
        state: Boolean,
        profile: Boolean,
        data: Object,
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
        toggleSave() {
            this.$emit('toggleSave');
        }
    },
    computed: {
        total() {
            if (!this.profile)
                return this.$store.state.progress.total;
            return this.data.tracks;
        },
        progress() {
            return this.$store.state.progress;
        },
        artists() {
            if (!this.profile)
                return this.$store.state.artists;
            return this.data.artists;
        },
        genres() {
            if (!this.profile)
                return this.$store.state.genres;
            return this.data.genres;
        },
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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