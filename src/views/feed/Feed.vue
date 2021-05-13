<template>
  <div>
    <v-btn @click="$store.dispatch('process/process')">
      Process
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Feed',
  components: {

  },
  computed: {
    ...mapGetters('user', [
      'user',
    ]),
  },
  watch: {
    user(val) {
      if (val === null) {
        this.$router.push('/');
      }
    }
  }
}
</script>
