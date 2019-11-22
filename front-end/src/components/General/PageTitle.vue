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
  },
  methods: {
  },
  computed: {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagetitle {
    padding: 22px 24px;
    width: calc(100% - 48px);
}


</style>