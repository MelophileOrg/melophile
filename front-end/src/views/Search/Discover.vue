<template>
  <div class="Discover content-padding-hori">
    <h1  class="discover-title slide-up" :style="{'--delay': + 0}">a powerful tool for music recommendations.</h1>
    <div class="flex flex-align-center">
      <h1 class="instruction slide-up" :style="{'--delay': + 1}">select up to 5 artist or tracks.</h1>
    </div>

    <div class="flex flex-align-center flex-center slide-up seed-search" :style="{'--delay': + 2}" v-if="seeds.length < 5">
        <div class="relative input" v-if="seeds.length < 5">
          <v-text-field class="slide-up " :style="{'--delay': + 3}" clearable v-model="searchInput" @click:clear="clearList" :autofocus="true" :dark="true" background-color="rgba(100,100,100,.15)" solo :placeholder="searchPlaceholder"></v-text-field>
          <MenuList @addItem="addSeed" id="menu-list" :delay="2" :items="list" :type="searchType" v-if="list.length > 0"/>
        </div>
        <v-select solo background-color="rgba(100,100,100,.15)" class="selector" @mousedown="clearList()" :items="searchTypes" v-model="searchType"/>
    </div>
    
    <div id="seeds">
      <div class="seed flex flex-align-center small-elevation fade-in" :class="{noleftmargin: index == 0}" :style="{'--delay': + 1}" v-for="(item, index) in seeds" :key="'seed-'+item._id">
        <div class="seed-img" :style="{backgroundImage: 'url(' + findImage(item.image) +')'}"/>
        <p class="seed-title">{{item.name}}</p>
        <v-btn @click="removeSeed(index)" text icon color="rgba(255,255,255,.8)" class="seed-cancel"><v-icon>mdi-close</v-icon></v-btn>
      </div>
    </div>
    <div class="results " v-if="recommends.length > 0 || noRecommends">
      <div class="recommends">
        <v-toolbar class="tool-bar" dense flat color="rgba(100,100,100,.0)">
          <v-toolbar-title>
            <h1 class="instructions slide-up" :style="{'--delay': + 0}" v-if="recommends.length > 0">Recommends</h1>
            <h1 class="instructions slide-up" :style="{'--delay': + 0}" v-if="noRecommends">No Recommends...</h1>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom color="#3d3d4b">
            <template v-slot:activator="{ on }">  
              <v-btn @click="getRecommends" v-on="on" v-if="!noRecommends && recommends.length > 0" class="refresh button-icon" text icon color="white">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </template>
            <span>Refresh</span>
          </v-tooltip>
        </v-toolbar>

        <div class="adv-controls-small" v-if="(recommends.length > 0 || noRecommends) && audioFeaturesData != null">
          <v-expansion-panels  accordion tile>
            <v-expansion-panel>
              <v-expansion-panel-header>Filters</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-expansion-panels accordion focusable tile multiple>
                  <v-expansion-panel v-for="(slide, index) in sliders" :key="'slider-'+ slide.type">
                    <v-expansion-panel-header>{{audioFeaturesData[slide.type].title}}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-expansion-panels class="description-panel">
                        <v-expansion-panel>
                          <v-expansion-panel-header>Description</v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <p class="description">{{audioFeaturesData[slide.type].description}}</p>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <v-switch :color="getColorString(audioFeaturesData[slide.type].color)" v-model="slide.targetToggle" @mouseup="toggleTargetSlider(index)" label="Target Value."/>
                      <div v-if="slide.targetToggle">
                        <v-slider hide-details :disabled="!slide.targetToggle" :color="getColorString(audioFeaturesData[slide.type].color)" thumb-label v-model="slide.target" :max="slide.maxValue" :min="slide.minValue"/>
                        <div class="flex flex-space-between labels" :style="{'--red': + audioFeaturesData[slide.type].color.red, '--green': + audioFeaturesData[slide.type].color.green, '--blue': + audioFeaturesData[slide.type].color.blue}">
                          <p class="label">{{audioFeaturesData[slide.type].minTag}}</p>
                          <p class="label">{{audioFeaturesData[slide.type].maxTag}}</p>
                        </div>
                      </div>
                      <v-switch :color="getColorString(audioFeaturesData[slide.type].color)" v-model="slide.rangeToggle" @mouseup="toggleRangeSlider(index)" label="Max and Min Value"/>
                      <div v-if="slide.rangeToggle">  
                        <v-range-slider dense :disabled="!slide.rangeToggle" :color="getColorString(audioFeaturesData[slide.type].color)" thumb-label v-model="slide.range" :max="slide.maxValue" :min="slide.minValue"/>
                        <div class="flex flex-space-between labels raise" :style="{'--red': + audioFeaturesData[slide.type].color.red, '--green': + audioFeaturesData[slide.type].color.green, '--blue': + audioFeaturesData[slide.type].color.blue}">
                          <p class="label">{{audioFeaturesData[slide.type].minTag}}</p>
                          <p class="label">{{audioFeaturesData[slide.type].maxTag}}</p>
                        </div>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-btn color="rgba(177, 176, 176, 0.062)" class="slide-up small-apply" dense @click="getRecommends">Apply Filters</v-btn>
                  <v-btn class="reset" color="rgba(177, 176, 176, 0.062)" @click="resetSettings">Reset Settings</v-btn>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div style="padding: 0px 5px 0px;">
        <List class="recommend-list" v-if="!noRecommends" :delay="0" :items="recommends" :type="0"/>
        </div>
      </div>
      <div class="adv-controls-big">
        <v-toolbar class="tool-bar" dense flat color="rgba(100,100,100,.0)">
          <v-toolbar-title>
            <h1 class="instructions slide-up" :style="{'--delay': + 0}" v-if="recommends.length > 0 || noRecommends">Filters</h1>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom color="#3d3d4b">
            <template v-slot:activator="{ on }">  
              <v-btn class="button-icon slide-up" v-on="on" text icon color="white" @click="resetSettings">
                <v-icon>mdi-undo</v-icon>
              </v-btn>
            </template>
            <span>Reset Filters</span>
          </v-tooltip>
          <v-tooltip bottom color="#3d3d4b">
            <template v-slot:activator="{ on }">  
              <v-btn class="button-icon slide-up" v-on="on" text icon color="white" @click="getRecommends">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </template>
            <span>Apply Filters</span>
          </v-tooltip>
          
        </v-toolbar>
        <div class="adv-controls-big-content slide-up"  :style="{'--delay': + 1, opacity: .9}">
          <v-expansion-panels accordion focusable tile multiple>
            <v-expansion-panel v-for="(slide, index) in sliders" :key="'slider-'+ slide.type">
              <v-expansion-panel-header>{{audioFeaturesData[slide.type].title}}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-expansion-panels class="description-panel">
                  <v-expansion-panel>
                    <v-expansion-panel-header>Description</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p class="description">{{audioFeaturesData[slide.type].description}}</p>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-switch :color="getColorString(audioFeaturesData[slide.type].color)" v-model="slide.targetToggle" @mouseup="toggleTargetSlider(index)" label="Target Value."/>
                <div v-if="slide.targetToggle">
                  <v-slider hide-details :disabled="!slide.targetToggle" :color="getColorString(audioFeaturesData[slide.type].color)" thumb-label v-model="slide.target" :max="slide.maxValue" :min="slide.minValue"/>
                  <div class="flex flex-space-between labels" :style="{'--red': + audioFeaturesData[slide.type].color.red, '--green': + audioFeaturesData[slide.type].color.green, '--blue': + audioFeaturesData[slide.type].color.blue}">
                    <p class="label">{{audioFeaturesData[slide.type].minTag}}</p>
                    <p class="label">{{audioFeaturesData[slide.type].maxTag}}</p>
                  </div>
                </div>
                <v-switch :color="getColorString(audioFeaturesData[slide.type].color)" v-model="slide.rangeToggle" @mouseup="toggleRangeSlider(index)" label="Max and Min Value"/>
                <div v-if="slide.rangeToggle">  
                  <v-range-slider dense :disabled="!slide.rangeToggle" :color="getColorString(audioFeaturesData[slide.type].color)" thumb-label v-model="slide.range" :max="slide.maxValue" :min="slide.minValue"/>
                  <div class="flex flex-space-between labels raise" :style="{'--red': + audioFeaturesData[slide.type].color.red, '--green': + audioFeaturesData[slide.type].color.green, '--blue': + audioFeaturesData[slide.type].color.blue}">
                    <p class="label">{{audioFeaturesData[slide.type].minTag}}</p>
                    <p class="label">{{audioFeaturesData[slide.type].maxTag}}</p>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>
  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuList from '@/components/List/MenuList.vue'
import List from '@/components/List/List.vue'

let constants = require('../../store/constants.js');
let audioFeaturesData = constants.audioFeatures;

export default {
  name: 'Discover',
  components: {
    MenuList,
    List,
  },
  data() {
    return {
      searchPlaceholder: "Search...",
      searchTypes: [{text: "Tracks", value: 0}, {text: "Artists", value: 1}],
      
      searchType: 0,
      searchInput: "",
      list: [],

      seeds: [],

      selectRangeorTarget: [
        {text: "Target", value: 0},
        {text: "Range", value: 1}
      ],

      audioFeaturesData: null,

      recommends: [],

      sliders: [
        {
          type: "valence",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
        {
          type: "danceability",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
        {
          type: "energy",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
        {
          type: "instrumentalness",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
        {
          type: "liveness",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
        {
          type: "tempo",
          minValue: 0,
          maxValue: 300,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 300],
          target: 118,
        },
        {
          type: "acousticness",
          minValue: 0,
          maxValue: 100,
          targetToggle: false,
          rangeToggle: false,
          range: [0, 100],
          target: 50,
        },
      ],
      noRecommends: false,
      
    }
  },
  methods: {
    resetSettings() {
      for (let i = 0; i < this.sliders.length;i++) {
        this.sliders[i].targetToggle = false;
        this.sliders[i].rangeToggle = false;
        this.sliders[i].range[0] = this.sliders[i].minValue;
        this.sliders[i].range[0] = this.sliders[i].maxValue;
        if (this.sliders[i].type == 'tempo') {
          this.sliders[i].target = 118;
        } else {
          this.sliders[i].target = this.sliders[i].maxValue / 2;
        }
      }
      if (this.seeds.length > 0) {
        this.getRecommends();
      }
    },
    toggleTargetSlider(index) {
      this.sliders[index].targetToggle = !this.sliders[index].targetToggle;
    },
    toggleRangeSlider(index) {
      this.sliders[index].rangeToggle = !this.sliders[index].rangeToggle;
    },
    clearList() {
      this.list.splice(0, this.list.length);
    },
    clearRecommends() {
      this.recommends.splice(0, this.recommends.length);
    },
    getColorString(color) {
      return "rgba(" + color.red + "," + color.green + "," + color.blue + ", 1)";
    },
    addSeed(index) {
      this.clearRecommends();
      for (let i = 0; i < this.seeds.length; i++) 
        if (this.seeds[i]._id == this.list[index]._id) return;
      this.seeds.push(this.list[index]);
      this.clearList();
      this.searchInput = "";
      this.getRecommends();
    },
    removeSeed(index) {
      this.seeds.splice(index, 1);
      this.clearRecommends();
      if (this.seeds.length != 0) {
        this.getRecommends();
      }
    },
    findImage(image) {
      if (image != "Undefined")
        return image;
      return "https://i.ibb.co/m6qD5cD/undefined-image.png";
    },
    seedSize() {
      if (this.seeds.length < 5) {
        return true;
      } else {
        this.selectionPhase = false;
        return false;
      }
    },
    async getRecommends() {
      this.noRecommends = false;
      let seed_artists = [];
      let seed_tracks = [];
      for (let i = 0; i < this.seeds.length; i++) {
        if ('album' in this.seeds[i]) {
          seed_tracks.push(this.seeds[i]._id);
        } else {
          seed_artists.push(this.seeds[i]._id);
        }
      }
      let options = {};
      if (seed_artists.length > 0) {
        options.seed_artists = seed_artists;
      }
      if (seed_tracks.length > 0) {
        options.seed_tracks = seed_tracks;
      }
      for (let i = 0; i < this.sliders.length; i++) {
        if (this.sliders[i].targetToggle) {
          let key = "target_" + this.sliders[i].type;
          if (this.sliders[i].type == 'tempo') {
            options[key] = this.sliders[i].target;
          } else {
            options[key] = this.sliders[i].target / 100;
          }
        }
        if (this.sliders[i].rangeToggle) {
          let minKey = "min_" + this.sliders[i].type;
          let maxKey = "max_" + this.sliders[i].type;
          if (this.sliders[i].type == 'tempo') {
            options[minKey] = this.sliders[i].range[0];
            options[maxKey] = this.sliders[i].range[1];
          } else {
            options[minKey] = this.sliders[i].range[0] / 100;
            options[maxKey] = this.sliders[i].range[1] / 100;
          }
        }
      }
      options.limit = 20;
      this.recommends = await this.jimmy.getRecommends(options);
      if (this.recommends.length == 0) {
        this.noRecommends = true;
      }
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
        console.log(response);
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
  },
  created() {
    this.audioFeaturesData = audioFeaturesData;
  }
}
</script>

<style scoped>
.button-icon {
  transform: translateX(8px);
}
.tool-bar{
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #52e3c171 !important;
}

.v-toolbar__title {
  transform: translateX(-16px);
}

.seed-search{
  margin-top: 10px;
}
.input {
  min-width: 200px;
  width: calc(100% - 160px);
  margin-right: 10px;
}
.refresh {
  margin-left: 10px;
}
.small-apply {
  margin-top: 20px;
}
.reset {
  margin-top: 20px;
  margin-bottom: 10px;
}
.description-panel
{
  margin-top: 10px;
}
.big-slide {
  display: block;
  min-height: 20px;
  width: 100%;
  padding: 10px 0px;
  border-bottom: 1px solid #52e3c2;
}
.results {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: nowrap;
}

.recommends {
  width: 65%;
}

.recommend-list {
  transform: translateX(-6px);
}

.adv-controls-big {
  display: block;
  width: 30%;
  margin-right: 30px;
}

.adv-controls-big-content {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  min-width: 340px;
  background-color: rgba(177, 176, 176, 0.032);
}

.adv-controls-small {
  display: none;
}

@media only screen and (max-width: 1050px) {
  .adv-controls-big {
    display: none;
  }

  .adv-controls-small {
    display: block;
  }

  .recommends {
    width: 100%;
  }
  .recommend-list {
    transform: translateX(0px) !important;
  }
}

@media only screen and (max-width: 465px) {
  .discover-title {
    font-size: 1.8rem;
    margin: 0px 0px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1rem;
  }
  .selector {
    font-size: 1rem;
  }
}

@media only screen and (max-width: 600px) {
  #seeds {
    justify-content: center !important;
  }
}

@media only screen and (min-width: 1264px) {
  .discover-title {
    font-size: 3rem !important;
    margin: 20px 0px !important;
    margin-top: 5px !important;
  }
}

.continue {
  margin-left: 20px;
}
.selector {
  margin-left: 0px !important;
}
.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: rgba(100, 100, 100, 0.116);
}

.raise {
  transform: translateY(-15px);
}

.labels {
  --red: 255;
  --green: 255;
  --blue: 255;
  width: 98%;
  margin: 0 auto;
}

p.label {
  color: rgb(var(--red), var(--green), var(--blue));
  font-weight: normal;
}

p.description {
  margin-top: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  font-size: 1.2rem;
  text-align: left;
  color: rgb(177, 176, 176);
}

h4 {
  font-family: 'Roboto', sans-serif;
  font-weight: normal;
  text-align: left;
}

.title-flex 
{
  justify-content: space-between;
  padding: 5px;
}

h3 {
  font-size: 1.3rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  margin: 0;
  margin-bottom: 5px;
  text-align: left;
  margin-right: 15px;
}

#adv-controls {
  margin-top: 5px;
}

.slider-control {
  width: 180px;
  padding: 10px;
  background-color: rgba(255, 254, 254, 0.021);
  margin: 10px;
}

#continue {
  display: block;
  margin-left: 0px;
  margin-top: 20px;
}

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

.seed.flex.flex-align-center.noleftmargin {
  margin-left: 0px;
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
  display: flex;
  justify-content: left;
  flex-wrap: nowrap;
  overflow: auto;
  flex: 1 1 100%;
  background-color: rgba(247, 243, 243, 0);
  border-radius: 10px;
  transform: translateY(-20px);
}

#seeds::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: #32323e;
}

#seeds::-webkit-scrollbar
{
    height: 5px;
    background-color: rgba(6, 6, 6, 0.007)
}

#seeds::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.11);
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
  color: #52e3c2;
  font-size: 2.5rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
  margin: 0px;
}

.instructions {
  margin: 5px 0px;
  color: #f7f7f746;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
}

.instruction {
  margin: 10px 0px;
  color: #f7f7f746;
  font-size: 2em;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
  opacity: 1;
}

.space-below {
  min-height: 50px;
  margin-bottom: 10px !important;
}

.selector {
  max-width: 150px;
  min-width: 120px;
  max-height: 48px !important;
  margin-bottom: 30px;
  margin-left: 12px;
  margin-right: 12px;
  font-size: 1.2rem;
}

h2 {
  color: #ffffffdc;
  margin-bottom: 12px;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  text-align: left;
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


</style>