<template>
  <div class="library">
    <v-tabs @change="changeTab" background-color="rgba(255,255,255,.05)" color="#ffffff" dark>
      <v-tab :ripple="true" v-for="tab in tabs" :key="'tabs'+tab.text">{{tab.text}}</v-tab>
    </v-tabs>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'library',
  components: {
    
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