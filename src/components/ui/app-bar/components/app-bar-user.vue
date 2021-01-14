<template>
  <div
    :class="$style.component"
    class="app-bar-user">
    <app-bar-user-menu v-if="loggedIn">
      <span
        :class="$style['profile-image']"
        :style="{
          'background-image': `url('${image}')`,
        }" />
    </app-bar-user-menu>

    <v-btn
      v-else
      :class="$style.login"
      color="pink"
      width="150"
      outlined
      @click="login">
      Login with Spotify
    </v-btn>
  </div>
</template>

<script>
import { 
  mapActions,
  mapGetters,
  mapState,
} from 'vuex';
import AppBarUserMenu from './app-bar-user-menu';

export default {
  name: 'AppBarUser',
  components: {
    AppBarUserMenu,
  },
  computed: {
    ...mapGetters('user', [
      'loggedIn',
      'image',
      'username',
    ]),
    ...mapState('user', [
      'profile',
    ]),
  },
  methods: {
    ...mapActions('user', [
      'login',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.app-bar-user button.v-btn:not(.v-btn--round).v-size--default {
  padding: 0;
}
</style>

<style lang="scss" module>
.component {
  height: 100%;
  display: flex;
  align-items: center;
}

.login {
  text-transform: none;
  font-size: 1.2rem !important;
  font-weight: 600;
}

.profile-image {
  --size: 3.8rem;

  display: block;
  height: var(--size);
  width: var(--size);
  background-size: 100% auto;
  border-radius: 50%;
}
</style>
