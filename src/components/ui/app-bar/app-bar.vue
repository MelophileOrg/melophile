<template>
  <v-app-bar
    color="grey-2"
    app
    flat
    dark>
    <div class="d-flex align-center justify-space-between limit-width">
      <div
        class="d-flex align-center"
        :class="$style.title">
        <img src="@/assets/logo/logo.svg" />
      </div>

      <v-spacer></v-spacer>

      <div
        v-if="user"
        :class="$style.user">

      </div>

      <v-btn
        v-if="!user"
        outlined
        @click="login">
        Login with Spotify
      </v-btn>

    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'AppBar',
  computed: {
    ...mapGetters('user', [
      'user',
    ]),
  },
  methods: {
    ...mapActions('user', [
      'login',
    ]),
  },
};
</script>

<style module>
.title img {
  height: 3rem;
  margin-right: .75rem;
}
</style>
