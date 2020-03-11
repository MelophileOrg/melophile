<template>
  <div class="redirect">
  </div>
</template>

<script>
export default {
    name: 'redirect',
    async created() {
        let data = {};
        let items = window.location.search.substring(1).split('&');
        for (let i = 0; i < items.length; i++) 
            data[items[i].substring(0, items[i].indexOf('='))] = items[i].substring(items[i].indexOf('=') + 1, items[i].length);
        this.$socket.client.emit('callback',{code: data.code, state: data.state} );
        this.$router.push("/");
    }
}
</script>
