<template>
  <div class="authorize">

  </div>
</template>

<script>
export default {
  name: 'authorize',
  async created() {
    await this.$store.dispatch('inicializeParseToken');
    if (this.$store.state.inicialized)
      this.$store.dispatch('loadLibrary');
    this.$router.push('/');
  }
}
</script>