<template>
  <div class="test">
      <button @click="results">RESULTS</button>
  </div>
</template>

<script>

export default {
  name: 'test',
  methods: {
      results() {
          console.log(this.$store.state);
      }
  },
  async created() {
    await this.$store.dispatch('loadLibrary');
    console.log(this.$store.state);
  }
}
</script>