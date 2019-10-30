<template>
    <div class="Extremes">
        <Selector :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0">
            <SearchItem class="searchItem" v-for="(track, index) in list" :showNum="true" :key="track.id + index" :data="track" :index="index" type="track"/>
        </div>
        <Empty v-else/>
    </div>
</template>

<script>
import Selector from '@/components/Library/Selector.vue'
import SearchItem from '@/components/Library/SearchItem.vue'
import Empty from '@/components/Library/Empty.vue'

export default {
  name: 'Extremes',
  components: {
      Selector,
      SearchItem,
      Empty
  },
  data() {
    return {
        list: [],
        type: "track",
        selector: [
            {type: "text", text: "List My"}, 
            {
                type: "select", 
                options: [
                    {value: "maxchart", text: "Most"},
                    {value: "minchart", text: "Least"}
                ]
            },
            {
                type: "select", 
                options: [
                    {value: "valence", text: "Happy"},
                    {value: "energy", text: "Energetic"},
                    {value: "danceability", text: "Danceable"},
                    {value: "tempo", text: "High Tempos"},
                    {value: "banger", text: "Bangers"},
                    {value: "acousticness", text: "Accoustic"},
                    {value: "instrumentalness", text: "Instrumental"},
                    {value: "liveness", text: "Live"},
                    {value: "speechiness", text: "Talking"},
                ]
            }
        ],
        catagory: "",
        chart: "",
        pendingStatus: true,

    }
  },
    methods: {
        select(val) {
            if (val == 'maxchart' || val == 'minchart')
                this.chart = val;
            else 
                this.catagory = val;
            this.checkResults();
        },
        checkResults() {
            if (this.catagory != "" && this.chart != "") {
                let ids = this.audioFeatures[this.catagory][this.chart];
                for (var i = 0; i < ids.length; i++) {
                    this.list.push(this.tracks[ids[i]]);
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
        audioFeatures() {
            return this.$store.state.audioFeatures;
        },
        tracks() {
            return this.$store.state.tracks;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Extremes {
    margin-bottom: 75px;
}

.list {
    margin-top: 30px;
}

.searchItem {
    max-width: 900px;
    
    margin: 0 auto;
}
</style>
