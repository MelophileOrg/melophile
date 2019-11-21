<template>
    <div class="TopSaved">
        <div v-if="progress.tracks || profile">
        <Selector @toggleSave="toggleSave2" :save="save" :state="giveState" :items="filterSelector" :load="false" :override="false" @pending="pending" @selection="select"/>
        <div class="list" v-if="list.length > 0 && !save">
            <SearchItem :profile="profile" :profileData="profileData" :topsaved="true" class="searchItem" v-for="(track, index) in list" :saved="true" :showNum="true" :key="'topsaved' + index" :data="track" :index="index" :type="type"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && !save"/>
        <div class="list" v-if="list.length > 0 && save" :class="{fade: (type == 'artist' && !stateartists) || (type == 'genre' && !stategenres)}">
            <SearchItem :profile="profile"  :profileData="profileData" :topsaved="true" class="searchItem" v-for="index in 20" :saved="true" :showNum="true" :key="'topsaved' + index" :data="list[index - 1]" :index="index - 1" :type="type"/>
        </div>
        <Empty class="list" v-if="list.length <= 0 && save"/>
        </div>
        <Loading v-else/>
    </div>
</template>

<script>
import Selector from '@/components/Menu/Selector.vue'
import SearchItem from '@/components/Lists/SearchItem.vue'
import Empty from '@/components/Lists/Empty.vue'
import Loading from '@/components/General/Loading.vue'

export default {
  name: 'TopSaved',
  props: {
      save: Boolean,
      stateartists: Boolean,
      stategenres: Boolean,
      profile: Boolean,
      data: Object,
      artistsAllowed: Boolean,
      genresAllowed: Boolean,
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
        toggleSave2() {
            this.$emit('toggleSave', "most_saved_" + this.type + "s");
        },
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
                    if (!this.profile)
                        this.list.push(this.$store.state[this.chart][ids[i]]);
                    else
                        this.list.push(this.data[this.chart][ids[i]]);
                }
                this.pendingStatus = false;
            }
        },
        pending() {
            this.pendingStatus = true;
            this.list = [];
        },
        filter() {
            if (!this.data.artistsAllowed) {
                this.selector.splice(0, 2, {type: "text", text: this.data.name + "'s Top Saved Genres"});
            }
            else if (!this.data.genresAllowed) {
                this.selector.splice(0, 2, {type: "text", text: this.data.name + "'s Top Saved Artists"});
            }
            else {
                this.selector.splice(0, 1, {type: "text", text: this.data.name + "'s Top Saved"})
            }
        }
    },
    computed: {
        giveState() {
            if (this.type == 'genre')
                return this.stategenres;
            return this.stateartists;
        },
        topSaved() {
            if (!this.profile)
                return this.$store.state.topSaved;
            return this.data.topSaved;
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
            return {genres: this.data.genres, artists: this.data.artists}
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

    .TopSaved {
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