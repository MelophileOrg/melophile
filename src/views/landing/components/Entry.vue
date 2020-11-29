<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1>
        your music taste is unique.
      </h1>

      <p>
        Explore and share your music like never before.
      </p>

      <v-btn
        color="primary"
        width="100%"
        x-large
        rounded
        @click="login">
        <v-icon left>mdi-spotify</v-icon>
        Login with Spotify
      </v-btn>
    </div>

    <div :class="$style['graphic-wrapper']">
      <img src="../../../assets/graphics/delivery.svg" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Entry',
  methods: {
    ...mapActions('user', [
      'login',
    ]),
  },
};
</script>

<style module>
.component {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.content {
}

.content h1 {
  --size: 6rem;
  font-size: var(--size);
  max-width: calc(7.5 * var(--size));
  line-height: calc(1 * var(--size));
  margin-bottom: 2rem;
}

.content p {
  --size: 2rem;
  font-size: var(--size);
  margin-bottom: 3rem;
}

.graphic-wrapper {
  width: 50%;
}

.graphic {
  display: block;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/graphics/delivery.svg');
  background-size: 100% auto;
}
</style>
