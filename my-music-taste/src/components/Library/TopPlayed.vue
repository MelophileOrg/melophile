<template>
    <div class="TopPlayed">
        <div v-if="progress.extremesLoaded">
        <Selector @toggleSave="toggleSave2" :save="save" :state="giveState" :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0 && !save">
            <SearchItem :topsaved="false" class="searchItem" v-for="(track, index) in list"  :saved="true" :showNum="true" :key="track.id + index" :data="track" :index="index" :type="type"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && !save"/>
        <div class="list" v-if="list.length > 0 && save" :class="{fade: (type == 'artist' && !stateartists) || (type == 'track' && !statetracks)}">
            <SearchItem :topsaved="false" class="searchItem" v-for="index in 20"  :saved="true" :showNum="true" :key="list[index -1].id + (index - 1)" :data="list[index - 1]" :index="index - 1" :type="type"/>
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
                    this.list.push(this.$store.state[this.chart][ids[i]]);
                }
                this.pendingStatus = false;
            }
        },
        pending() {
            this.pendingStatus = true;
            this.list = [];
        }
    },
    computed: {
        giveState() {
            if (this.type == 'artist')
                return this.stateartists;
            return this.statetracks;
        },
        topPlayed() {
            return this.$store.state.topPlayed;
        },
        progress() {
            return this.$store.state.progress;
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
}

.searchItem {
    max-width: 900px;
    
    margin: 0 auto;
}

.fade {
  opacity: .3;
}
</style>
