<template>
  <div class="selector">

  </div>
</template>

<script>

export default {
  name: 'selector',
  props: {
      title: String,
  },
  methods: {
    route() {
      this.$router.push(this.link);
    }
  }
}
</script>

<style scoped>
.selector {
    width: calc(100vw - 260px);
    padding: 22px 24px;
    background: rgba(206, 206, 206, 0);
}


</style>