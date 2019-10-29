<template>
  <div class="searchitem">
    <div @click="selectTrack(data.id)" class="search-song" :style="{'--delay': index}">
      <div>
        <div class="search-image" :style="{backgroundImage: 'url(\'' + data.album.images[0].url + '\')'}"/>
      </div>
      <div>
        <h1 class="search-title">{{data.name}}</h1>
        <div class="artists">
          <div v-for="artistnum in 4" :key="data.name + '-' + (artistnum - 1)">
            <h4  class="artist" v-if="(artistnum - 1) < data.artists.length">{{data.artists[(artistnum - 1)].name}}<h4 class="space" v-if="(artistnum - 1) < data.artists.length - 1"></h4></h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchitem',
  props: {
    type: String,
    data: Object,
    index: Number,
  },
  methods: {
    selectTrack(id) {
      this.$router.push("/songs/" + id);
    }
  },
  created() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-song {
  cursor: pointer;
  --delay: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 3px 0px;
  font-family: 'Roboto', sans-serif;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s) linear;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

.space {
  margin: 0;
  margin-right: 7px;
}

.artists .artist {
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.514) !important;
  font-weight: lighter;
  text-transform: capitalize;
  font-size: 15px;
  margin: 0;
}

.artists {
  display: flex;
  margin: 0;
  margin-left: 13px;
}

.search-image {
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 5px;
  background-size: auto 100%;
  background-position: center center;
}

.search-title {
  color: white;
  margin: 0 10px;
  font-weight: lighter;
  font-size: 28px;
  text-align: left;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-song:hover .search-title
{
  text-decoration: underline;
}
</style>