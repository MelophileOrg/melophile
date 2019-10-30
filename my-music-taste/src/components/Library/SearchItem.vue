<template>
  <div class="searchitem">
    <div @click="selectTrack(data.id)" class="search-song" :style="{'--delay': index}">
      <h1 v-if="showNum">{{index + 1}}</h1>
      <div>
        <div class="search-image" :style="{backgroundImage: 'url(\'' + data.album.images[0].url + '\')'}"/>
      </div>
      <div class="info">
        <h1 class="search-title">{{data.name}}</h1>
        <div v-if="type == 'track'" class="artists">
          <div v-for="artistnum in 4" :key="data.name + '-' + (artistnum - 1)">
            <h4 class="artist" v-if="(artistnum - 1) < data.artists.length">{{artists[data.artists[(artistnum - 1)]].name}}<h4 class="space" v-if="(artistnum - 1) < data.artists.length - 1"></h4></h4>
          </div>
        </div>
        <div v-if="type == 'artist'" class="artists">
          <div v-for="artistnum in 4" :key="data.name + '-' + (artistnum - 1)">
            <h4 class="artist" v-if="(artistnum - 1) < data.genres.length">{{data.genres[(artistnum - 1)]}}<h4 class="space" v-if="(artistnum - 1) < data.genres.length - 1"></h4></h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchitem',
  components: {
  },
  props: {
    type: String,
    data: Object,
    index: Number,
    showNum: Boolean,
  },
  methods: {
    selectTrack(id) {
      this.$router.push("/songs/" + id);
    }
  },
  computed: {
    artists() {
      return this.$store.state.artists;
    }
  },
  created() {
      console.log(this.data);
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
  position: relative;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.103);
  height: 60px;
  margin: 3px 0px;
  font-family: 'Roboto', sans-serif;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s) linear;
}

.scroll {
  margin-left: 10px;
  width: calc(100% - 95px) !important;
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
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.info {
  display: block;
  width: calc(100% - 100px);
}

.search-song:hover .search-title
{
  text-decoration: underline;
}

h1 {
  color: rgba(255, 255, 255, 0.288);
  margin: 0;
  font-size: 1.2em;
  text-align: center;
  width: 25px;
  margin-right: 10px;
}
</style>