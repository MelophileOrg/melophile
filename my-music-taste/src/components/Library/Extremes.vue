<template>
    <div class="Extremes">
        <div v-if="progress.extremesLoaded">
        <Selector @toggleSave="toggleSave2" :save="save" :state="state" :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0 && !save">
            <SearchItem :topsaved="false" class="searchItem" v-for="(track, index) in list" :saved="true"  :showNum="true" :key="track.id + index" :data="track" :index="index" type="track"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && !save"/>
        <div class="list" v-if="list.length > 0 && save">
            <SearchItem :topsaved="false" class="searchItem" v-for="index in 10" :saved="true"  :showNum="true" :key="list[index - 1].id + index" :data="list[index - 1]" :index="index - 1" type="track"/>
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
  name: 'Extremes',
  props: {
      save: Boolean,
      state: Boolean,
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
        toggleSave2() {
            this.$emit('toggleSave');
        },
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
        },
        progress() {
            return this.$store.state.progress;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Extremes {
    margin-bottom: 75px;
    position: relative;
}

.list {
    margin-top: 35px;
    position: relative;
}

@media only screen and (max-width: 720px) {
    .list {
        margin-top: 15px;
    }

    .Extremes {
        margin-bottom: 0px;
    }
}

.searchItem {
    max-width: 900px;
    margin: 0 auto;
}

.choosebutton {
  right: 10px !important;
  top: -20px !important;

}
</style>
