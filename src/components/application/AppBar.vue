<template>
  <v-app-bar
    app
    color="dark1"
    elevation="0">
    <v-row class="limit-width">
      <div
        id="title"
        class="d-flex align-center"
        @click="routeHome">
        <div class="logo"/>

        <h1 class="text">
          MELOPHILE
        </h1>
      </div>

      <v-spacer/>

      <v-btn
        v-if="!user"
        color="white"
        :text="true"
        @click="login">
        Sign in with Spotify
      </v-btn>

      <div
        v-else
        class="user">

      </div>
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
  data: () => ({

  }),
  methods: {
    routeHome() {
      if (this.user) {
        this.$router.push('/home');
      } else {
        this.$router.push('/');
      }
    },
    async login() {
      const response = await this.$store.dispatch('user/login');
      window.open(response.data);
    },
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
};
</script>

<style lang="css" scoped>
#title {
  cursor: pointer;
}

#title .text {
  font-size: 1.3rem;
  font-weight: 300;
}

#title .logo {
  --size: 1.4;
  display: block;
  width: calc(var(--size) * 1rem);
  height: calc(var(--size) * 1rem);
  background-image: url('../../assets/logo-90.svg');
  background-size: 100% 100%;
  margin-right: 1px;
}
</style>
