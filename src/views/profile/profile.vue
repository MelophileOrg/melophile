<template>
  <two-column-layout>
    <template v-slot:header>
      <profile-header
        :user="userData"
        :isMe="isMe"
        :tab="tab"
        @tab="handleTab" />
    </template>

    <template v-slot:content>
      

      <charts v-if="tab === 2" />
    </template>
  </two-column-layout>
</template>

<script>
import Charts from '@/views/profile/components/charts.vue';
import { getUser } from '@/views/profile/api/get-user.js';
import { getTopPlayed } from '@/views/profile/api/get-top-played.js';
import { mapState } from 'vuex';
import ProfileHeader from '@/views/profile/components/header.vue';
import TwoColumnLayout from '@/components/layout/two-column-layout.vue';


export default {
  name: 'Profile',
  components: {
    TwoColumnLayout,
    ProfileHeader,
    Charts,
  },
  data: () => ({
    userData: null,
    tab: 0,
  }),
  computed: {
    ...mapState('user', [
      'user',
    ]),
    isMe() {
      return this.user && this.user.spotify.id === this.$route.params.id;
    },
  },
  async created() {
    this.userData = await getUser(this.$route.params.id);
    const stuff = await getTopPlayed(this.$route.params.id, 'tracks', 0);
    console.log(stuff);
  },
  methods: {
    handleTab(val) {
      this.tab = val;
    },
  },
};

// Get Users Top Played

// Get basic stats
</script>
