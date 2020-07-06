<template>
  <div>

  </div>
</template>

<script>
/**
 * Redirect
 * Spotify login redirects here and the token is turned into an
 * auth token by the server.
 */
export default {
  name: 'Redirect',
  /**
   * Parses code from URL and sends to server.
   */
  created() {
    // Parse that juicy token
    const data = {};
    const items = window.location.search.substring(1).split('&');

    for (let i = 0; i < items.length; i += 1) {
      data[items[i].substring(0, items[i].indexOf('='))] = items[i].substring(items[i].indexOf('=') + 1, items[i].length);
    }
    // Let's get that auth token.
    this.$store.dispatch('user/callback', {
      code: data.code,
      state: data.state,
    });
  },
};
</script>

<style scoped>

</style>
