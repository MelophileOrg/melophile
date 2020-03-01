<template>
  <div class="Library content-padding-hori">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon library-icon"/>
      <h1 class="page-title">Your Library</h1>
    </div>
    <div class="page-bar slide-up" :style="{'--delay': + 1}">
      <v-tabs background-color="#393945" color="#52e3c2" v-model="tab" show-arrows>
        <v-tab>
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-music-box-outline</v-icon>
          Tracks
        </v-tab>
        <v-tab>
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-account-box-outline</v-icon>
          Artists
        </v-tab>
        <v-tab>
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-library-music-outline</v-icon>
          Playlists
        </v-tab>
      </v-tabs>
    </div>
    <List class="transform-left" :delay="1" :items="list" :type="type" v-if="list.length > 0"/>
  </div>
</template>

<script>
import List from '@/components/List/List.vue'

export default {
  name: 'Library',
  components: {
    List,
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

  }
}
</script>

<style scoped>
.library-icon {
  background-image: url('../../assets/nav-bar-icons/library.svg');
}
</style>