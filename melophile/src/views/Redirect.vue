<template>
  <div class="Redirect">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Redirect',
  async created() {
    let data = {};
    let items = window.location.search.substring(1).split('&');
    for (let i = 0; i < items.length; i++) 
      data[items[i].substring(0, items[i].indexOf('='))] = items[i].substring(items[i].indexOf('=') + 1, items[i].length);
    if (await this.$store.dispatch('callback', {code: data.code, state: data.state})) {
      this.$socket.client.emit('process', {authToken: (await axios.get('/api/auth/token')).data});
    }
    this.$router.push("/");
  }
}
</script>