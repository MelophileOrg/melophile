<template>
  <v-card
    color="grey-2"
    :class="$style.component">
    <div :class="[
        $style.banner,
        {
          loader: true,
          loaderspace: true,
        },
      ]">
    </div>

    <div :class="$style.details">
      <profile-image :user="user" />
      
      <div :class="$style.user">
        <h1>
          {{ username }}
        </h1>

        <p>
          Can I Change My Mind - Roy Buchanan
        </p>
      </div>
    </div>

    <v-tabs
      v-model="tabControl"
      background-color="grey-2"
      grow>
      <v-tab>
        Profile
      </v-tab>

      <v-tab>
        Timeline
      </v-tab>

      <v-tab>
        Charts
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script>
import ProfileImage from './image.vue';

export default {
  name: 'ProfileHeader',
  components: {
    ProfileImage,
  },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    isMe: {
      type: Boolean,
      deafult: false,
    },
    tab: {
      type: Number,
      deafult: 0,
    },
  },
  computed: {
    username() {
      return this.user ? this.user.username : '';
    },
    tabControl: {
      get() {
        return this.tab;
      },
      set(val) {
        this.$emit('tab', val);
      }
    }
  },
};
</script>

<style module>
.component {
  display: block;
  width: 100%;
  margin-bottom: 2rem;
}

.banner {
  display: block;
  position: relative;
  width: 100%;
  height: 15rem;
}

.details {
  display: flex;
  padding: 2.4rem;
}

.details .user {
  margin-left: 3rem;
}

.details .user h1 {
  color: var(--grey-10);
  font-size: 2.5rem;
  font-weight: 300;
}

.details .user p {
  font-size: 1.5rem;
}

.actions {
  width: 100%;
  display: flex;
  height: 5.6rem;
  justify-content: flex-end;
  padding: 0 2.4rem;
  align-items: center;
}
</style>