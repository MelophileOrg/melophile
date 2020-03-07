<template>
  <div id="main-flex" class="library">
    <NavBar/>
    <div id="main">
      <PageTitle title="Your Library"/>
      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import PageTitle from '@/components/Menu/PageTitle.vue'
import Progress from '@/components/General/Progress.vue'

export default {
  name: 'library',
  components: {
    NavBar,
    PageTitle,
    Progress
  },
  data() {
    return {
      playlistsReady: false,
      playlists: [],
    }
  },
  methods: {
    async getPlaylistData(limit, offset) {
      let playlists = await this.$store.dispatch('getPlaylists', {limit: limit, offset: offset});
      for (let i = 0; i < playlists.length; i++) {
        this.playlists.push(await this.condensePlaylist(playlists[i]));
      }
      if (playlists.length < limit) {
        this.playlistsReady = true;
        console.log(this.playlists);
        return;
      }
      else {
        this.getPlaylistData(limit, offset + limit);
      }
    },
    condensePlaylist(playlist) {
      let playlistObject = {};
      playlistObject.id = playlist.id;
      playlistObject.name = playlist.name;
      playlistObject.collaborative = playlist.collaborative;
      playlistObject.owner = playlist.owner;
      playlistObject.public = playlist.public;
      playlistObject.tracks = playlist.tracks.total;
      if (playlist.images.length > 0)
        playlistObject.image = playlist.images[0].url;
      return playlistObject;
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    }
  },
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    this.getPlaylistData(50, 0);
  }
}
</script>