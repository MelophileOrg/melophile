<template>
  <div class="library">
    <PageTitle title="Your Library" description="Search for more focused statistics."/>
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
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
// @ is an alias to /src
import PageTitle from '@/components/General/PageTitle.vue'

export default {
  name: 'library',
  components: {
    PageTitle
  },
  data() {
    return {
      tab: 0,
      tabs: [
        {text: "Tracks"},
        {text: "Artists"},
        {text: "Genres"},
        {text: "Playlists"}
      ],
    }
  },
  methods: {
    changeTab(number) {
      this.tab = number;
    }
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