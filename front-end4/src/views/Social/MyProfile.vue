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
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    if (!this.inicialized)
      this.$router.push("/login");
    let profileLink = "/social/profile/" + this.$store.state.user.id;
    this.$router.push(profileLink);
  }
}
</script>