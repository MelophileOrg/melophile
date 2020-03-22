<template>
  
</template>

<script>
  export default {
    name: 'HelloWorld',
    computed: {
      babies() {
        return this.$root.$data.babies;
      }
    }
  }
</script>
