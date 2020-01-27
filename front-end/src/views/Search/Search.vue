<template>
  <div class="Search">
    <div class="spacing">
      <v-text-field class="input slide-up" :style="{'--delay': + 0}" clearable v-model="searchInput" @click:clear="clearList" :autofocus="true" :dark="true" background-color="rgba(100,100,100,.15)" solo placeholder="Search..."></v-text-field>
      <v-select v-if="searchInput.length > 0" class="selector slide-up" color="#52e3c2" :style="{'--delay': + 1}" dense :default="0" @mousedown="clearList()"  :items="types" v-model="type"/>
    </div>
    <List :delay="2" :items="list" :type="type" v-if="list.length > 0"/>
    <EmptyList :delay="2" :num="8" v-else/>
  </div>
</template>

<script>
import List from '@/components/List/List.vue'
import EmptyList from '@/components/List/EmptyList.vue'

export default {
  name: 'Search',
  components: {
    List,
    EmptyList
  },
  data() {
    return {
      loading: true,
      list: [],
      searchInput: "",
      types: [{text: "Tracks", value: 0}, {text: "Artists", value: 1}, {text: "Albums", value: 2}, {text: "Playlists", value: 3}],
      type: 0,
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
  },
  watch: {
    searchInput: async function() {
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.type);
        if (response == null) return;
        this.list = response;
      } else {
        this.clearList();
      }
    },
    type: async function() {
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.type);
        if (response == null) return;
        this.list = response;
      } else {
        this.clearList();
      }
    }
  }, 
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    }
  },
  created() {
    this.clearList();
    this.$store.dispatch('newRoute', "search");
  }
}
</script>

<style scoped>
.spacing {
  width: 100%;
  height: 100%;
  padding: 0px 5px;
  padding-top: 0px;
}

@media only screen and (min-width: 1264px) {
  .spacing {
    padding-top: 20px;
  }
}

.selector {
  max-width: 150px;
  min-width: 120px;
  max-height: 48px !important;
  margin-left: 3px;
}

.input {
  font-size: 20px;
}


.v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 0px !important;
}

</style>