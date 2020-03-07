<template>
    <div class="login">
        <div class="form">
          <button @click="login">Authorize</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    login() {
      this.$store.dispatch('inicializeGetToken');
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  async created() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.418);
  animation: fade-in .3s ease;
}


</style>