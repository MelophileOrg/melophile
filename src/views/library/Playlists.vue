<template>
    <div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Playlists',
  computed: {
    ...mapGetters('user', [
      'loggedIn',
    ]),
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push('/');
    }
  },
};
</script>
