<template>
  <div class="Discover">
    <h1 class="discover-title slide-up" :style="{'--delay': + 0}">a powerful tool for music recommendations.</h1>
    <div class="flex flex-align-center slide-up" :style="{'--delay': + 1}" v-if="seeds.length < 5">
      <h2>Recommends based on</h2>
        <v-select color="#52e3c2" class="selector" @mousedown="clearList()" :items="searchTypes" dense v-model="searchType"/>
    </div>
    <div class="relative" v-if="seeds.length < 5">
      <v-text-field class="input slide-up" :style="{'--delay': + 2}" clearable v-model="searchInput" @click:clear="clearList" :autofocus="true" :dark="true" background-color="rgba(100,100,100,.15)" solo :placeholder="searchPlaceholder"></v-text-field>
      <MenuList @addItem="addSeed" id="menu-list" :delay="2" :items="list" :type="searchType" v-if="list.length > 0"/>
    </div>
    <div id="seeds" class="flex flex-wrap">
      <div class="seed flex flex-align-center small-elevation" v-for="(item, index) in seeds" :key="'seed-'+item._id">
        <div class="seed-img" :style="{backgroundImage: 'url(' + findImage(item.image) +')'}"/>
        <p class="seed-title">{{item.name}}</p>
        <v-btn @click="removeSeed(index)" text icon color="rgba(255,255,255,.8)" class="seed-cancel"><v-icon>mdi-close</v-icon></v-btn>
      </div>
      <div class="dead-seed small-elevation" v-for="i in 5 - seeds.length" :key="'deadseed-'+i">
      </div>
    </div>
  </div>
</template>

<script>
import MenuList from '@/components/List/MenuList.vue'

export default {
  name: 'Discover',
  components: {
    MenuList
  },
  data() {
    return {
      searchPlaceholder: "Search...",
      searchTypes: [{text: "Tracks", value: 0}, {text: "Artists", value: 1}],
      
      searchType: 0,
      searchInput: "",
      list: [],

      seeds: [],
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
    addSeed(index) {
      this.seeds.push(this.list[index]);
      this.clearList();
      this.searchInput = "";
    },
    removeSeed(index) {
      this.seeds.splice(index, 1);
    },
    findImage(image) {
      if (image != "Undefined")
        return image;
      return "https://i.ibb.co/m6qD5cD/undefined-image.png";
    }
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    }
  },
  watch: {
    searchInput: async function() {
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.searchType);
        if (response == null) return;
        this.list = response.splice(0, 10);
      } else {
        this.clearList();
      }
    },
    searchType: async function() {
      if (this.searchInput.length > 0) {
        await this.clearList();
        let response = await this.jimmy.search(this.searchInput, 0, this.searchType);
        if (response == null) return;
        this.list = response.splice(0, 10);
      } else {
        this.clearList();
      }
    }
  }
}
</script>

<style scoped>
.seed.flex.flex-align-center {
  width: 260px;
  background-color: #dddddd1a;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px;
  border-radius: 3px;
  overflow: hidden;
  margin: 10px;
  position:relative;
}

.dead-seed {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px;
  border-radius: 3px;
  width: 260px;
  background-color: #9696960e;
  margin: 10px;
  height: 60px;
}

.seed-cancel {
  position: absolute;
  right: 10px;
}

.seed-img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 3px;
  margin-right: 10px;
  background-size: auto 100%;
  background-position: center center;
}

#seeds {
  justify-content: left;
  flex-wrap: wrap;
}

.seed-title {
  display: block;
  color: rgb(247, 243, 243);
  text-align:left;
  margin: 0;
  max-width: calc(100% - 82px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.discover-title {
  margin: 5px 0px;
  color: #52e3c2;
  font-size: 2.5em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
}

.selector {
  max-width: 150px;
  min-width: 120px;
  max-height: 48px !important;
  margin-bottom: 0px;
  margin-left: 12px;
  margin-right: 12px;
  font-size: 1.2em;
}

h2 {
  color: #ffffffdc;
  margin-bottom: 12px;
  font-size: 1.5em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: #32323e;
}

.v-expansion-panel::before {
  box-shadow: none;
}

.relative {
  position: relative;
}

#menu-list {
  position: absolute;
  top: 48px;
  z-index: 100;
}

@media only screen and (max-width: 465px) {
  .discover-title {
    font-size: 1.8em;
    margin: 0px 0px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1em;
  }
  .selector {
    font-size: 1em;
  }
}

@media only screen and (max-width: 600px) {
  #seeds {
    justify-content: center !important;
  }
}

@media only screen and (min-width: 1264px) {
  .discover-title {
    font-size: 3em;
    margin: 20px 0px;
  }
}
</style>