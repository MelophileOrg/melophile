<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        text>
        <slot />
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        :class="$style.me"
        @click="goToMe">
        <v-list-item-avatar>
          <v-img :src="image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            v-html="username"
            :class="$style.username" />

          <v-list-item-subtitle :class="$style.action">
            View Profile
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <v-list-item
        :class="$style.option"
        link>
        <v-list-item-avatar>
          <v-icon>
            mdi-cog
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="$style.title">
            Settings & Privacy
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :class="$style.option"
        link>
        <v-list-item-avatar>
          <v-icon>
            mdi-help-circle
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="$style.title">
            Help
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :class="$style.option"
        link
        @click="logout">
        <v-list-item-avatar>
          <v-icon>
            mdi-logout
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="$style.title">
            Log Out
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <v-list-item
        :class="$style.option"
        link>
        <v-list-item-avatar>
          <v-icon>
            mdi-message-alert
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="$style.title">
            Give Feedback
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :class="$style.option"
        link
        href="https://www.patreon.com/andrewyoung">
        <v-list-item-avatar>
          <v-icon>
            mdi-thumb-up
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="$style.title">
            Support on Patreon
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'AppBarUserMenu',
  computed: {
    ...mapGetters('user', [
      'id',
      'image',
      'username',
    ]),
  },
  methods: {
    ...mapActions('user', [
      'logout',
    ]),
    goToMe() {
      this.$router.push(`/profile/${this.id}`);
    },
  },
}
</script>

<style lang="scss" module>
.me {
  margin-bottom: .8rem;
}

.me:hover {
  cursor: pointer;
}

.me .username {
  font-size: 1.5rem;
}

.action:hover {
  text-decoration: underline;
}

.me .action {
  font-size: 1.3rem;
}

.option .title {
  font-size: 1.4rem;
}
</style>
