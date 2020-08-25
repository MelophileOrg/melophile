<template>
  <div
    class="limit-width"
    :class="$style.component">
    <div :class="$style['list-wrapper']">
      <list
        :items="tracks"
        type="track"
        title="Tracks"
        action="Show More" />
    </div>

    <div :class="$style['list-wrapper']">
      <list
        :items="artists"
        type="artist"
        title="Artists"
        action="Show More" />
    </div>

    <div :class="$style['list-wrapper']">
      <list
        :items="albums"
        type="album"
        title="Albums"
        action="Show More" />
    </div>

    <div :class="$style['list-wrapper']">
      <list
        :items="playlists"
        type="playlist"
        title="Playlists"
        action="Show More" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import List from '@/components/ui/lists/list.vue';

export default {
  name: 'Search',
  components: {
    List,
  },
  computed: {
    ...mapGetters('search', [
      'query',
      'displayed',
      'tracks',
      'albums',
      'artists',
      'playlists',
    ]),
  },
  async created() {
    if (this.$route.params.query !== this.query) {
      await this.$store.commit('search/setQuery', this.$route.params.query);
      this.search();
    }
  },
  methods: {
    ...mapActions('search', [
      'search',
    ]),
  },
};
</script>

<style module>
.component {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.list-wrapper {
  flex: 1 1 50rem;
  margin: 2rem 0;
}
</style>
