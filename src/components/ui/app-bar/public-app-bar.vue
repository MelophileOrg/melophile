<template>
  <v-app-bar
    :class="$style.component"
    color="transparent"
    app
    flat
    fixed>
    <div :class="$style.row">
      <logo />

      <div :class="$style.actions">
        <div :class="$style['public-links']">
          <v-btn
            :class="$style['app-bar-button']"
            width="150"
            text>
            About
          </v-btn>

          <v-btn
            :class="$style['app-bar-button']"
            width="150"
            text>
            Patreon
          </v-btn>

          <v-btn
            :class="$style['app-bar-button']"
            width="150"
            text>
            Feedback
          </v-btn>
        </div>

        <app-bar-user v-if="!disableLogin" />
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import Logo from '~/components/ui/logo/logo';
import AppBarUser from './components/app-bar-user';

export default {
  name: 'PublicAppBar',
  components: {
    Logo,
    AppBarUser,
  },
  props: {
    disableLogin: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
  }),
  methods: {
    goHome() {
      console.log(this.$route);
    },
  },
}
</script>

<style lang="scss" module>
.row {
  display: flex;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 120rem;
  width: 90vw;
}

.public-links {
  align-items: center;
  display: flex;
  height: 100%;
  margin-left: 2rem;
}

.actions {
  align-items: center;
  display: flex;
  height: 100%;
}

.app-bar-button {
  text-transform: none;
  font-size: 1.2rem !important;
  font-weight: 400;
}
</style>
