<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1>
        Your Relationship with Music
      </h1>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
      </p>

      <div :class="$style.actions">
        <v-btn
          color="accent-1"
          width="135px"
          dark
          outlined>
          Learn More
        </v-btn>

        <v-btn
          color="accent-1"
          width="135px"
          dark>
          Login with Spotify
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  layout: 'public',
  colorMode: 'dark',
}
</script>

<style lang="scss">
@import '~/assets/styles/config.scss';

.theme--dark.v-application {
  @include themed() {
    background: theme($background);
  }
}
</style>

<style lang="scss" module>
.component {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.content {
  width: calc(100% - 4rem);
  max-width: 75rem;
}

.content h1,
.content p {
  text-align: center;
}

.content h1 {
  margin-bottom: 1.8rem;
}

.content p {
  margin-bottom: 4rem;
}

.content .actions {
  display: flex;
  justify-content: center;
}

.content .actions button:first-of-type {
  margin-right: 2rem;
}
</style>
