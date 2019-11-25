<template>
  <div class="search">
    <div id="search-bar">
    <v-text-field @change="search" label="Search for a Track" outlined prepend-inner-icon="fa-search"></v-text-field>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'search',
  components: {
    
  },
  data() {
    return {
      searchId: 0,
    }
  },
  methods: {
    async search(query) {
      console.log(query);
      this.searchId += 1;
      let id = this.searchId;
      let promise = await this.$store.dispatch('searchSpotify', {query: query});
      if (id == this.searchId) {
        console.log(promise);
      }
      else {
        console.log("Skipped");
      }
      
    },
  },
  created() {

  },
}
</script>

<style scoped>
#search-bar {
  padding: 22px;
  padding-bottom: 0px;
  background: rgba(255, 255, 255, 0.048)
}

.v-text-field .v-input_prepend-inner {
  padding-right: 10px !important;
}

div.v-input__prepend-innder {
  padding-right: 10px !important;
}
</style>