<template>
  <div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Month',
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
