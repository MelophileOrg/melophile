<template>
  <v-alert
    border="left"
    type="error"
    :value="show"
    dismissible
    dark
    dense
    max-width="calc(100vw - 4rem)">
    Lost Connection to Server
  </v-alert>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ConnectionSnackbar',
  computed: {
    ...mapState('connection', [
      'connected',
    ]),
    show() {
      return !this.connected;
    },
  },
};
</script>