<template>
  <div class="library">
    <div id="page-title">
      <div id="library" class="page-title-icon"></div>
      <h1 id="page-title-text">Your Library</h1>
    </div>
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" fixed-tabs color="#ffffff" dark :style="{'--red': + color.r, '--green': + color.g, '--blue': + color.b}">
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
      <v-tab-item :value="0">
        <v-card flat tile>
          <v-card-text>Tracks</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="1">
        <v-card flat tile>
          <v-card-text>Artists</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="2">
        <v-card flat tile>
          <v-card-text>Genres</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="3">
        <v-card flat tile>
          <v-card-text>Playlists</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    
  </div>
</template>

<script>
export default {
  name: 'library',
  components: {
  },
  data() {
    return {
      color: {r: 255, g: 255, b: 255, a: .05},
      tab: 0,
      tabs: [
        {text: "Tracks", color: {r: 237, g: 201, b: 72}},
        {text: "Artists", color: {r: 78, g: 121, b: 167}},
        {text: "Genres", color: {r: 89, g: 161, b: 79}},
        {text: "Playlists", color: {r: 225, g: 87, blue: 89}}
      ],
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
      this.color = this.tabs[number].color;
    },
  },
  computed: {
    progress() {
      return this.$store.state.progress;
    }
  },
  created() {

  },
}
</script>

<style scoped>
.library {
  display: block;
  width: 100%;
}

div.v-tab {
  justify-content: center;
}
</style>