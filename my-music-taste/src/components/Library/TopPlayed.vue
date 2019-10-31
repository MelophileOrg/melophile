<template>
    <div class="TopPlayed">
        <div v-if="progress.extremesLoaded">
        <Selector :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0">
            <SearchItem class="searchItem" v-for="(track, index) in list"  :saved="true" :showNum="true" :key="track.id + index" :data="track" :index="index" :type="type"/>
        </div>
        <Empty class="list" v-else/>
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

.searchItem {
    max-width: 900px;
    
    margin: 0 auto;
}
</style>
