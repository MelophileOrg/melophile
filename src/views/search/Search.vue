<template>
    <div>
      <div :class="$style.controls">
        <div :class="$style.type">
          <v-select
            v-model="type"
            :items="types"
            max-width="100"
            outlined
            dense />
        </div>

        <v-pagination
          v-model="page"
          :length="pages"
          :total-visible="7" />
      </div>

      <list :items="items" />
    </div>
</template>

<script>
import api from '@/api';
import List from '@/components/ui/list/List';

export default {
  name: 'Search',
  components: {
    List,
  },
  data: () => ({
    type: 'track',
    types: [
      {
        text: 'Tracks',
        value: 'track',
      },
      {
        text: 'Artists',
        value: 'artist',
      },
      {
        text: 'Albums',
        value: 'album',
      },
      {
        text: 'Playlists',
        value: 'playlist',
      },
    ],

    limit: 30,

    page: 1,
    pages: 1,

    items: null,
  }),
  computed: {
    query() {
      return this.$route.params.query;
    },
    offset() {
      return (this.page - 1) * this.limit;
    },
  },
  watch: {
    query() {
      this.search();
    },
    type() {
      this.search();
    },
    page() {
      this.search();
    },
  },
  created() {
    this.search();
  },
  methods: {
    async search() {
      const response = await api.spotify.search.search(
        this.$route.params.query,
        this.type,
        this.offset,
        this.limit,
      );
      this.items = response.data.items;
      this.pages = Math.ceil(response.data.total / this.limit);
    },
  },
};
</script>

<style module>
.controls {
  display: flex;
  width: 100%;
  margin: 2rem 3rem;
}

.controls .type {
  width: 30%;
  max-width: 15rem;
}
</style>
