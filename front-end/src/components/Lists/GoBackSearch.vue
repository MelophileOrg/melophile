<template>
  <div class="GoBackSearch">
    <input type="text" @click="goBack" class="button" placeholder="Return to Search"/>
  </div>
</template>

<script>
export default {
  name: 'GoBackSearch',
  methods: {
    goBack() {
      this.$router.push('/search');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button {
    width: 100%;
    padding-left: 32px;
    height: 75px;
    width: 100%;
    background-color: rgba(75, 75, 75, 0.377);
    color: rgba(255, 255, 255, 0.205);
    border: 0;
    font-size: 25px;
    cursor: pointer;
    text-align: left;
}

@media only screen and (max-width: 720px) {
  .button {
    font-size: 20px !important;
    height: 50px !important;
    width: 100vw !important;
  }
}


</style>
