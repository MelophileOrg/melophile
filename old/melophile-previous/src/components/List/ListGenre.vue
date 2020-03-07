<template>
  <div class="ListGenre">
    <div v-if="genre != null">
        <h1 @click="routeGenre()">{{genre.name}}</h1>
        <div class="flex sub-flex">
            <h2>{{formatNumber(genre.track_num)}} Tracks</h2>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ListGenre',
    props: {
        genre: Object,
    },
    methods: {
      routeGenre() {
        this.$router.push('/genre/' + this.genre.name);
      },
      formatNumber(val) {
        if (val == null) return "0";
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
};
</script>


<style scoped>

h1 {
  margin: 0 0;
  display: block;
  text-align: left;
  text-transform: capitalize;
  max-width: calc(100%);
  font-size: 1.1em; 
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
  text-overflow: ellipsis;
}

h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    text-transform: capitalize;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
}

h2:hover {
    text-decoration: underline;
}

.sub-flex {
  max-width: 100%;
  overflow: hidden;
}

h2.empty {
  color: hsla(0,0%,100%,.114)!important;
}

h2.empty:hover {
   text-decoration: none;
   cursor: default;
}
</style>