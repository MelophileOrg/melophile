<template>
  <div class="test">
      <button @click="save">RESULTS</button>
  </div>
</template>

<script>

export default {
  name: 'test',
  methods: {
      results() {
          console.log(this.$store.state);
      },
      async save() {
        await this.$store.dispatch('saveLibrary', {
          name: "Andrew",
          private: false,
          include: {
            numerical_data: true,
            most_saved_artists: true,
            audio_features: true,
            most_saved_genres: true,
            numerical_features: true,
            probability_features: true,
            added_timeline: true,
            happiness_distribution: true,
            energy_distribution: true,
            danceability_distribution: true,
            banger_distribution: true,
            genre_standard_dev: true,
            most_played_tracks: true,
            most_played_artists: true,
            extremes: true,
        }});
      },
  },
  async created() {
    
    console.log(this.$store.state);
  }
}
</script>