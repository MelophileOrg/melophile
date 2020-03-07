<template>
  <div class="SearchBar">
    <h1>{{title}}</h1>
    <div class="flex align-bottom">
      <img src="../../assets/icons/search.svg">
      <v-text-field v-model="text" color="rgb(255,255,255)" dark placeholder="Search for a track..." single-line outlined></v-text-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    title: String,
  },
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
.SearchBar {
  padding: 24px;
}

.align-bottom {
  align-items: flex-start;
}

img {
  height: 30px;
  width: 30px;
  margin-right: 10px;
  margin-top: 4px;
}

.SearchBar h1 {
  font-size: 20px;
  margin-bottom: 15px;
  text-align: left;
  color: white;
  font-weight: lighter;
}


@media only screen and (max-width: 720px) {

}

</style>
