<template>
  <div class="Search content-padding-hori">
    <div class="spacing">
      <v-text-field class="input slide-up" :style="{'--delay': + 0}" clearable v-model="searchInput" @click:clear="clearList" :autofocus="true" :dark="true" background-color="rgba(100,100,100,.15)" solo placeholder="Search..."></v-text-field>
      <v-select v-if="searchInput.length > 0" class="selector slide-up" color="#52e3c2" :style="{'--delay': + 1}" dense :default="0" @mousedown="clearList()"  :items="types" v-model="type"/>
    </div>
    <div style="padding: 0px 5px 0px; width: calc(100% - 5px);">
      <h1 class="none-found" v-if="none">No {{types[type].text}} Found...</h1>
      <List :delay="2" :items="list" :type="type" v-if="list.length > 0"/>
    </div>
  </div>
</template>

<script>
import List from '@/components/List/List.vue'

export default {
  name: 'Search',
  components: {
    List,
  },
  data() {
    return {
      loading: true,
      list: [],
      searchInput: "",
      types: [{text: "Tracks", value: 0}, {text: "Artists", value: 1}, {text: "Albums", value: 2}, {text: "Playlists", value: 3}],
      type: 0,
      none: false,
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
  },
  watch: {
    searchInput: async function() {
      this.none = false;
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.type);
        console.log(response);
        if (response == null) return;
        this.list = response;
        if (this.list.length == 0) {
          this.none = true;
        }
      } else {
        this.clearList();
      }
    },
    type: async function() {
      this.none = false;
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.type);
        if (response == null) return;
        this.list = response;
        if (this.list.length == 0) {
          this.none = true;
        }
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

.none-found {
  font-weight: lighter;
  color: white;
  opacity: .5;
  font-size: 1.8rem;
  padding-top: 15px;
  text-align: left;
  text-transform: lowercase;
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