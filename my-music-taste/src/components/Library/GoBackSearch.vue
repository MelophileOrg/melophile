<template>
  <div class="GoBackSearch">
    <div @click="goBack" class="button">Return to Search</div>
  </div>
</template>

<script>
export default {
  name: 'GoBackSearch',
  methods: {
    goBack() {
      this.$router.push('/songs');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button {
    width: 100%;
    padding-left: 32px;
    padding-top: 10px;
    height: 40px;
    background-color: rgba(50, 50, 50, 0.377);
    color: rgba(255, 255, 255, 0.205);
    border: 0;
    font-size: 25px;
    cursor: pointer;
    text-align: left;
}

@media only screen and (max-width: 720px) {
  .button {
    padding-top: 15px !important;
    padding-bottom: 5px;
    font-size: 20px !important;
    height: 35px !important;
    width: 100vw !important;
  }
}


</style>
