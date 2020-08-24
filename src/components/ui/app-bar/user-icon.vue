<template>
  <v-menu
    v-if="user"
    offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        height="5rem"
        :class="$style.component"
        rounded
        text>
        <div
          :class="$style.image"
          :style="{ backgroundImage: `url('${image}')` }" />

        <v-icon
          v-html="'mdi-chevron-down'"
          color="grey-6" />
      </v-btn>
    </template>

    <v-list>
      <v-list-item :class="$style.me">
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
        link>
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
  

  <v-btn
    v-else
    outlined
    @click="login">
    Login with Spotify
  </v-btn>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'UserIcon',
  computed: {
    ...mapGetters('user', [
      'user',
      'image',
      'username',
    ]),
  },
  methods: {
    ...mapActions('user', [
      'login',
      'logout',
    ]),
  },
};
</script>

<style module>
.component {
  display: flex;
  align-items: center;
}

.component .image {
  display: block;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-size: 100% auto;
  background-position: center center;
  margin-right: .5rem;
}

.me {
  margin-bottom: .8rem;
}

.me:hover {
  cursor: pointer;
}

.me .username {
  font-size: 1.5rem;
}

.me:hover .username {
  text-decoration: underline;
}

.action {
  font-size: 1.3rem;
}

.option .title {
  font-size: 1.4rem;
}
</style>