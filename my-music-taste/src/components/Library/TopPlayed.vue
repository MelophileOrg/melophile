<template>
    <div class="TopPlayed">
        <div v-if="progress.extremesLoaded || profile">
        <Selector @toggleSave="toggleSave2" :save="save" :state="giveState" :items="filterSelector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0 && !save">
            <SearchItem :profile="profile" :profileData="profileData" :topsaved="false" class="searchItem" v-for="(track, index) in list"  :saved="true" :showNum="true" :key="'topplayed' + index" :data="track" :index="index" :type="type"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && !save"/>
        <div class="list" v-if="list.length > 0 && save" :class="{fade: (type == 'artist' && !stateartists) || (type == 'track' && !statetracks)}">
            <SearchItem :profile="profile" :profileData="profileData" :topsaved="false" class="searchItem" v-for="index in 20"  :saved="true" :showNum="true" :key="'topplayed' + (index - 1)" :data="list[index - 1]" :index="index - 1" :type="type"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && save"/>
        </div>
        <Loading v-else/>
    </div>
</template>

<script>
import Selector from '@/components/Library/Selector.vue'
import SearchItem from '@/components/Library/SearchItem.vue'
import Empty from '@/components/Library/Empty.vue'
import Loading from '@/components/General/Loading.vue'

export default {
  name: 'TopPlayed',
  props: {
      save: Boolean,
      statetracks: Boolean,
      stateartists: Boolean,
      profile: Boolean,
      data: Object,
      artistsAllowed: Boolean,
      tracksAllowed: Boolean,
  },
  components: {
      Selector,
      SearchItem,
      Empty,
      Loading
  },
  data() {
    return {
        list: [],
        type: "track",
        selector: [
            {type: "text", text: "My Top Played"}, 
            {
                type: "select", 
                options: [
                    {value: "tracks", text: "Tracks"},
                    {value: "artists", text: "Artists"}
                ]
            },
            {type: "text", text: "in the last"}, 
            {
                type: "select", 
                options: [
                    {value: 0, text: "4 Weeks"},
                    {value: 1, text: "6 Months"},
                    {value: 2, text: "Few years"},
                ]
            }
        ],
        chart: "",
        range: -1,
        pendingStatus: true,
    }
  },
    methods: {
        toggleSave2() {
            this.$emit('toggleSave', "most_played_" + this.type + "s");
        },
        select(val) {
            if (val == 'tracks' || val == 'artists') {
                this.chart = val;
                if (val == 'tracks')
                    this.type = "track";
                else 
                    this.type = "artist";
            }
            else 
                this.range = val;
            this.checkResults();
        },
        checkResults() {
            if (this.chart != "" && (this.range == 0 || this.range == 1 || this.range == 2)) {
                let ids = this.topPlayed[this.chart][this.range];
                for (var i = 0; i < ids.length; i++) {
                    if (!this.profile)
                        this.list.push(this.$store.state[this.chart][ids[i]]);
                    else  {
                        let track = this.data[this.chart][ids[i]];
                        track.id = ids[i];
                        this.list.push(track);
                    }
                }
                this.pendingStatus = false;
            }
            console.log(this.list);
        },
        pending() {
            this.pendingStatus = true;
            this.list = [];
        },
        filter() {
            if (!this.data.artistsAllowed) {
                this.selector.splice(0, 2, {type: "text", text: this.data.name + "'s Top Played Tracks"});
            }
            else if (!this.data.tracksAllowed) {
                this.selector.splice(0, 2, {type: "text", text: this.data.name + "'s Top Played Artists"});
            }
            else {
                this.selector.splice(0, 1, {type: "text", text: this.data.name + "'s Top Played"})
            }
        }
    },
    computed: {
        giveState() {
            if (this.type == 'artist')
                return this.stateartists;
            return this.statetracks;
        },
        topPlayed() {
            if (!this.profile)
                return this.$store.state.topPlayed;
            return this.data.topPlayed;
        },
        progress() {
            return this.$store.state.progress;
        },
        filterSelector() {
            if (!this.profile)
                return this.selector;
            this.filter();
            return this.selector;
        },
        profileData() {
            if (!this.profile)
                return null;
            return {tracks: this.data.tracks, artists: this.data.artists};
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.TopPlayed {
    margin-bottom: 75px;
}

.list {
    margin-top: 35px;
}

@media only screen and (max-width: 500px) {
    .list {
        margin-top: 10px;
    }

    .TopPlayed {
        margin-bottom: 0px !important;
    }
}

.searchItem {
    max-width: 900px;
    
    margin: 0 auto;
}

.fade {
  opacity: .3;
}
</style>
