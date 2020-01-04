<template>
  <div class="redirect">
      
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'redirect',
    async created() {
        let data = {};
        let items = window.location.search.substring(1).split('&');
        for (let i = 0; i < items.length; i++) {
            data[items[i].substring(0, items[i].indexOf('='))] = items[i].substring(items[i].indexOf('=') + 1, items[i].length);
        }
        let response = await axios.get('/api/auth/callback?code=' + data.code + '&state=' + data.state);
        await this.$store.dispatch('inicialize', response.data);
        this.$router.push("/");
    }
}
</script>
