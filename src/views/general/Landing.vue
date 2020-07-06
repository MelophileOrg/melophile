<template>
  <div class="Landing">

  </div>
</template>

<script>
export default {
  class: 'Landing',
  async created() {
    const status = await this.$store.dispatch('user/getUser');
    if (status) {
      this.$router.push('/home');
    }
  },
};
</script>
