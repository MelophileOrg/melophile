<template>
  <div class="authorize">

  </div>
</template>

<script>
export default {
  name: 'authorize',
  async created() {
    await this.$store.dispatch('inicializeParseToken');
    this.$router.push('/');
  }
}
</script>