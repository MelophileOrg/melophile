<template>
  <div class="Library">
    <v-tabs fixed-tabs dark background-color="rgba(240,240,240,.1)" v-model="tab">
      <v-tab>
        Analysis
      </v-tab>
      <v-tab>
        Tracks
      </v-tab>
      <v-tab>
        Artists
      </v-tab>
      <v-tab>
        Playlists
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Library',
  components: {

  },
  data() {
    return {
      tab: 0,
    }
  }
}
</script>