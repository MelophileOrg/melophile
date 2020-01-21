<template>
  <div class="Search">
    <div class="spacing">
    <v-text-field class="input" prepend-icon="fa-search" v-model="searchInput" :autofocus="true" :dark="true"  background-color="rgba(100,100,100,.15)" solo placeholder="Search..."></v-text-field>
    </div>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Search',
  components: {

  },
  data() {
    return {
      searchInput: "",
      list: [],
    }
  },
  methods: {
  },
  watch: {
    searchInput: function() {
      if (this.searchInput == "") {
        this.list = [];
      } else {
        console.log(this.searchInput);
        this.$socket.client.emit('search', {query: this.searchInput, offset: 0, type: 'track'});
      }
    }
  }, 
  computed: {
    results() {
      return [];
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