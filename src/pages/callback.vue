<template>
  <v-container :class="$style.component">
    <img src="~/assets/images/loader/bars.svg" />

    <h2>
      Authorizing Your Account
    </h2>
  </v-container>
</template>

<script>
export default {
  name: 'Callback',
  layout: 'empty',
  colorMode: 'dark',
  async created() {
    await this.$store.dispatch('user/callback', {
      code: this.$route.query.code,
      state: this.$route.query.state,
    });

    this.$router.push('/feed');
  }
}
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.component h2 {
  margin-top: 2rem;
}

.component img {
  width: 5rem;
}
</style>
