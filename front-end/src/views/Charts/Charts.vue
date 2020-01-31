<template>
  <div class="Charts content-padding-hori">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon chart-icon"/>
      <h1 class="page-title">Your Top Charts</h1>
    </div>
    <div class="page-bar slide-up elevation-1" :style="{'--delay': + 1}">
      <v-tabs background-color="#393945" color="#52e3c2" v-model="tab" show-arrows>
        <v-tab> 
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-repeat-once</v-icon>
          Top Played
        </v-tab>
        <v-tab> 
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-heart-outline</v-icon>
          Top Liked
        </v-tab>
        <v-tab> 
          <v-icon class="tab-icon" size="20" :style="{opacity: .3}">mdi-poll</v-icon>
          Extremes
        </v-tab>
      </v-tabs>
    </div>

    <div class="window flex flex-align-center options slide-up elevation-1 no-margin-bottom" :style="{'--delay': + 2}">
      <div v-for="(option, index) in options[tab]" :key="'option' + index" class="option">
        <p v-if="option.type == 'text'">{{option.text}}</p>
        <v-select @change="getChart" :value="0" v-if="option.type == 'selector'" :style="{'--width': + option.width}" hide-details v-model="option.value" :items="option.items" dense background-color="rgba(100,100,100,0)" class="selector" @mousedown="clearList()"/>
      </div>
    </div>

    <List :feature="feature" :trackNum="tab == 1" :items="list" :number="true" :type="type" :delay="3" v-if="list.length > 0"/>
    
    
  </div>
</template>

<script>
import List from '@/components/List/List.vue'

export default {
  name: 'Charts',
  components: {
    List
  },
  data() {
    return {
      tab: 0,
      options: [
        [
          {type: "text", text: "top played"},
          {type: "selector", width: 80, value: 0, items: [{text: "tracks", value: 0},{text: "artists", value: 1}]},
          {type: "text", text: "in the last few"},
          {type: "selector", width: 95,  value: 0, items:  [{text: "weeks", value: 0},{text: "months", value: 1},{text: "years", value: 2}]},
        ],
        [
          {type: "text", text: "top liked"},
          {type: "selector", width: 85,  value: 0, items: [{text: "artists", value: 0},{text: "genres", value: 1}]},
        ],
        [
          {type: "text", text: "my tracks with the"},
          {type: "selector", width: 90,  value: 0, items: [{text: "highest", value: 0},{text: "lowest", value: 1}]},
          {type: "selector", width: 175,  value: 0, items: [{text: "happiness", value: 0},{text: "danceability", value: 1}, {text: "energy", value: 2}, {text: "tempo", value: 3}, {text: "acousticness", value: 4},{text: "instrumentalness", value: 5},{text: "liveness", value: 6},{text: "speechiness", value: 7}]},
          {type: "text", text: "value"},
        ],
      ],

      savedTypes: [
        {text: "Artists", value: 1},
        {text: "Genres", value: 2},
      ],

      time_range: 0,
      list: [],
    }
  },
  methods: {
    clearList() {
      this.list.splice(0, this.list.length);
    },
    async getChart() {
      await this.clearList();
      switch(this.tab) {
        case 0:
          this.list = await this.jimmy.getTopPlayed(this.options[0][1].value, this.options[0][3].value);
          break;
        case 1:
          this.list = await this.jimmy.getTopSaved(this.options[1][1].value);
          break;
        case 2:
          this.list = await this.jimmy.getExtreme(this.options[2][1].value, this.options[2][2].value);
          break;
        default:
          this.clearList();
      }
    },
  },
  computed: {
    jimmy() {
      return this.$store.state.jimmy;
    },
    type() {
      switch(this.tab) {
        case 0:
          if (this.options[0][1].value == 0) return 0;
          else return 1;
        case 1:
          if (this.options[1][1].value == 0) return 1;
          else return 4;
        case 2:
          return 0;
        default:
          return 0;
      }
    },
    feature() {
      if (this.tab != 2) return null;
      let features = ['valence', 'danceability', 'energy', 'tempo', 'acousticness', 'instrumentalness', 'liveness',  'speechiness'];
      return features[this.options[2][2].value];
    }
  },
  watch: {
    tab: function() {
      this.getChart();
    },
  },
  async created() {
    await this.getChart();
  }
}
</script>

<style scoped>
.chart-icon {
  background-image: url('../../assets/nav-bar-icons/chart.svg');
}
.options {
  margin-top: 20px;
  padding-top: 8px;
  padding-left: 12px;
  overflow-x: auto;
}

.options p {
  margin-right: 5px;
  margin-bottom: 0px;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.486);
}

.options .selector {
  --width: 0;
  max-width: calc(var(--width) * 1px);
  min-width: calc(var(--width) * 1px);
  max-height: 48px !important;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
}
</style>