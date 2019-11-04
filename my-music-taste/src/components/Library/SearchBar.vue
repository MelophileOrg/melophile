<template>
  <div class="SearchBar">
    <input v-model="text" placeholder="Search..." type="text"/>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
        text: "",
    }
  },
  watch: {
    text: function(val)
    {
        this.$emit('changed', val);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

input {
    width: 100%;
    padding-left: 32px;
    height: 75px;
    width: 100%;
    background-color: rgba(50, 50, 50, 0.377);
    color: white;
    border: 0;
    font-size: 25px;
}

@media only screen and (max-width: 720px) {
  input {
    font-size: 20px !important;
    height: 50px !important;
    width: 100vw !important;
  }
}

</style>
