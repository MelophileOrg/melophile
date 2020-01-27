<template>
  <div class="Library">
    <h1  class="library-title slide-up" :style="{'--delay': + 0}">your library</h1>
    <v-tabs dark background-color="#32323e" v-model="tab">
      <v-tab>
        Tracks
      </v-tab>
      <v-tab>
        Artists
      </v-tab>
      <v-tab>
        Playlists
      </v-tab>
    </v-tabs>
    <List class="transform-left" :delay="1" :items="list" :type="type" v-if="list.length > 0"/>
    <EmptyList class="transform-left" :delay="1" :num="8" v-else/>
  </div>
</template>

<script>
import List from '@/components/List/List.vue'
import EmptyList from '@/components/List/EmptyList.vue'

export default {
  name: 'Library',
  components: {
    List,
    EmptyList
  },
  data() {
    return {
      tab: 0,
      list: [],
      type: "track",
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
  },
  watch: {
    tab: async function() {

    }
  },
  computed: {
  }
}
</script>

<style scoped>
.library-title {
  color: #52e3c2;
  font-size: 2.5em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
  margin: 0px;
  margin-top: 15px;
}
div.v-tab {
  margin: 5px 0px;
  color: #f7f7f746;
  font-size: 1em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
}
.transform-left {
  transform: translateX(-6px);
}
</style>