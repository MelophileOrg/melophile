<template>
  <div class="ListPlaylist">
        <div v-if="playlist != null">
            <h1 @click="routePlaylist()">{{playlist.name}}</h1>
            <div class="flex sub-flex">
              <h2>{{playlist.total_tracks}} Tracks | {{playlist.owner}}</h2>
              <h2></h2>
            </div>
        </div>
  </div>
</template>

<script>

export default {
    name: 'ListPlaylist',
    props: {
        playlist: String,
    },
    methods: {
      routePlaylist() {
        this.$router.push('/playlist/' + this.playlist._id);
      }
    }
};
</script>


<style scoped>
h1 {
    margin: 0 0;
    display: block;
    text-align: left;
    max-width: calc(100%);
    font-size: 1.1em; 
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-weight: lighter;
    text-transform: capitalize;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 10px;
    flex-shrink: 0;
}

.sub-flex {
  max-width: 100%;
  overflow: auto;
}
</style>