<template>
  <div>
    <h1>
      Authenticating
    </h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Callback',
  created() {
    this.callback({
      code: this.$route.query.code,
      state: this.$route.query.state,
    });
  },
  methods: {
    ...mapActions('user', [
      'callback',
    ]),
  },
};
</script>
