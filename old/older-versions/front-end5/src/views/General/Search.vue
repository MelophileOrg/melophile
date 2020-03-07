<template>
  <div id="main-flex" class="searchsong">
    <NavBar/>
    <div id="main">
        <SearchBar @changed="search" title="Search for a track"/>
        <SearchItem :topsaved="false" v-for="(track, index) in list" :key="track.id + index" :data="track" :index="index" :saved="false" type="track"/>
        <Loading v-if="!trackSelected && list.length == 0 && waiting && !empty"/>
        <div id="no-results" v-if="!trackSelected && list.length == 0 && !waiting && !load && !empty">
          <h1>No Results Found</h1>
        </div>
        <EmptyLarge v-if="empty"/>
        <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/Navigation/NavBar.vue'
import SearchBar from '@/components/Lists/SearchBar.vue'
import SearchItem from '@/components/Lists/SearchItem.vue'
import EmptyLarge from '@/components/Lists/EmptyLarge.vue'
import Loading from '@/components/General/Loading.vue'
import Progress from '@/components/General/Progress.vue'

export default {
  name: 'searchsong',
  components: {
    NavBar,
    SearchBar,
    SearchItem,
    EmptyLarge,
    Loading,
    Progress,
  },
  data() {
      return {
        trackSelected: false,
      list: [],
      trackData: null,
      load: true,
      waiting: false,
      empty: true,
      setId: 0,
      trackPrepared: false,

      trackId: "",
      }
  },
  methods: {
    async search(query) {
      if (query == "")
      {
        this.empty = true;
        this.trackPrepared = false;
        this.trackSelected = false;
        this.waiting = false;
        this.list = [];
        return;
      }
      this.list = [];
      this.trackPrepared = false;
      this.trackSelected = false;
      this.empty = false;
      this.load = false;
      this.waiting = true;
      this.setId += 1;
      let id = this.setId;
      let promise = await this.$store.dispatch('searchSpotify', {query: query});
      if (id != this.setId)
        return;
      this.waiting = false;
      this.trackSelected = false;
      this.list = promise.tracks.items;
    },
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    }
  },
  created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>
.loading {
  margin-top: 100px;
}

#no-results h1 {
  color: rgba(255, 255, 255, 0.171);
  margin-top: 100px;
  font-weight: lighter;
}
</style>