<template>
  <div id="main-flex" class="myprofile">
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'myprofile',
  components: {
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
  },
  created() {
    if (!this.inicialized)
      this.$router.push("/login");
    this.$router.push("/social/profile/" + this.$store.state.user.id);
  }
}
</script>