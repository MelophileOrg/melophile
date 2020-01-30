<template>
  <div class="Library">
    <h1 class="library-title slide-up" :style="{'--delay': + 0}">Your Library</h1>
    <div class="page-bar">
    <v-tabs background-color="#393945" color="#52e3c2" v-model="tab">
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
    </div>
    <List @listEnd="getTracks" class="transform-left" :delay="1" :items="list" :type="type" v-if="list.length > 0"/>
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
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
    getTracks(offset) {
      if (offset == 0) this.clearList();
      console.log(offset);
    },
    getArtists() {

    },
    getPlaylists() {

    }
  },
  watch: {
    tab: async function() {
 
    }
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    }
  }
}
</script>

<style scoped>
.library-title {
  color: #52e3c2;
  font-size: 2em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
  margin: 0px;
  margin-top: 15px;
}

</style>