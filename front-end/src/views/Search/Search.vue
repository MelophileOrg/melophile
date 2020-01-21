<template>
  <div class="Search">
    <div class="spacing">
    <v-tabs v-model="type">
      <v-tab>
        Tracks
      </v-tab>
      <v-tab>
        Artists
      </v-tab>
      <v-tab>
        Albums
      </v-tab>
      <v-tab>
        Playlists
      </v-tab>
    </v-tabs>
    <v-text-field class="input" prepend-icon="fa-search" v-model="searchInput" :autofocus="true" :dark="true"  background-color="rgba(100,100,100,.15)" solo placeholder="Search..."></v-text-field>
    </div>
    <ListItem :id="item" :key="type + item" :type="type" v-for="item in list"/>
  </div>
</template>

<script>
import ListItem from '@/components/List/ListItem.vue'

export default {
  name: 'Search',
  components: {
    ListItem
  },
  data() {
    return {
      searchInput: "",
      type: 0,
    }
  },
  watch: {
    searchInput: function() {
      if (this.searchInput.length > 0) {
        this.$socket.client.emit('search', {query: this.searchInput, offset: 0, type: this.type});
      }
    }
  }, 
  computed: {
    list() {
      return this.$store.state.data.list.list;
    }
  }
}
</script>

<style scoped>
.spacing {
  width: 100%;
  height: 100%;
  padding: 20px 48px;
}

.input {
  font-size: 20px;
}

</style>