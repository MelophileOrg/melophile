<template>
  <div id="main-flex" class="searchsong">
    <NavBar/>
    <div id="main">
        <SearchBar @changed="search"/>
        <SearchItem v-for="(track, index) in list" :key="track.id + index" :data="track" :index="index" type="track"/>
        <div class="loading" v-if="!trackSelected && list.length == 0 && waiting && !empty">
          <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
        </div>
        <div id="no-results" v-if="!trackSelected && list.length == 0 && !waiting && !load && !empty">
          <h1>No Results Found</h1>
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import SearchBar from '@/components/Library/SearchBar.vue'
import SearchItem from '@/components/Library/SearchItem.vue'

export default {
  name: 'searchsong',
  components: {
    NavBar,
    SearchBar,
    SearchItem
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
      {
        return;
      }
      this.waiting = false;
      this.trackSelected = false;
      this.list = promise.tracks.items;
    },
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created() {
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