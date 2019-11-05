<template>
    <div class="TopSaved">
        <div v-if="progress.extremesLoaded">
        <Selector :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0">
            <SearchItem :topsaved="true" class="searchItem" v-for="(track, index) in list" :saved="true" :showNum="true" :key="track.id + index" :data="track" :index="index" :type="type"/>
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
  name: 'TopSaved',
  components: {
      Selector,
      SearchItem,
      Empty,
      Loading
  },
  data() {
    return {
        list: [],
        type: "artists",
        selector: [
            {type: "text", text: "My Top Saved"}, 
            {
                type: "select", 
                options: [
                    {value: "artists", text: "Artists"},
                    {value: "genres", text: "Genres"}
                ]
            },
        ],
        chart: "",
        pendingStatus: true,

    }
  },
    methods: {
        select(val) {
            this.chart = val;
            if (val == "artists")
                this.type = "artist";
            else
                this.type = "genre";
            this.checkResults();
        },
        checkResults() {
            if (this.catagory != "") {
                let ids = this.topSaved[this.chart];
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
        topSaved() {
            return this.$store.state.topSaved;
        },
        progress() {
            return this.$store.state.progress;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.TopSaved {
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
</style>
