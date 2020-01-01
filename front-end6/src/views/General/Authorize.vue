<template>
  <div class="authorize">
    <h1>Authorizing</h1>
  </div>
</template>

<script>
export default {
  name: 'authorize',
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  async created() {
    console.log("hi");
    await this.$store.dispatch('inicializeParseToken');
    if (this.$store.state.inicialized)
      this.$store.dispatch('loadLibrary');
    this.$router.push('/');
  },
}
</script>