<template>
  <v-alert
    border="left"
    color="indigo"
    :value="show"
    dismissible
    dark
    dense
    max-width="calc(100vw - 4rem)">
    {{ message }} {{ formatPercent }}
  </v-alert>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProcessingSnackbar',
  computed: {
    ...mapState('profile', [
      'message',
      'percent',
    ]),
    ...mapState('connection', [
      'connected',
    ]),
    show() {
      return this.percent !== 0 && this.connected;
    },
    formatPercent() {
      return `${Math.ceil(this.percent * 100)}%`;
    },
  },
};
</script>