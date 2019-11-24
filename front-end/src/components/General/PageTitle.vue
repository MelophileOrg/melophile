<template>
  <div class="pagetitle">
      <h1>{{title}}</h1>
      <h2>{{description}}</h2>
  </div>
</template>

<script>

export default {
  name: 'pagetitle',
  props: {
      title: String,
      description: String,
      button: Object,
  },
  methods: {
    route() {
      this.$router.push(this.link);
    }
  }
}
</script>

<style scoped>
.pagetitle {
    width: calc(100vw - 260px);
    padding: 22px 24px;
    background: rgba(0, 0, 0, 0.555);
}

.pagetitle h1 {
  color: white;
  text-align: left;
  margin: 0;
  font-size: 32px;
}

.pagetitle h2 {
  color: rgba(255, 255, 255, 0.589);
  text-align: left;
  margin: 0;
  margin-top: 8px;
  font-size: 16px;
  font-weight: lighter;
}


@media screen and (max-width: 720px) {
  .pagetitle {
    width: 100vw;
  }
  
  .pagetitle h1 {
    font-size: 24px;
  }
}


</style>