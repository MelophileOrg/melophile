<template>
  <div class="Library">
    <v-tabs dark background-color="rgba(240,240,240,.1)" v-model="tab">
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
    <h1 class="type slide-up" :style="{'--delay': + 0}">{{typeText}}</h1>
    <List :delay="1" :items="list" :type="type" v-if="list.length > 0"/>
    <EmptyList :delay="1" :num="8" v-else/>
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
    typeText() {
      let text = ["Tracks", "Artists", "Playlists"];
      return text[this.tab];
    }
  }
}
</script>

<style scoped>
.type {
  margin: 5px 0px;
  color: #f7f7f746;
  font-size: 1.5em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
}
</style>