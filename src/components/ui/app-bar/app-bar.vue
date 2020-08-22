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

        <h1>
          Melophile
        </h1>
      </div>

      <v-spacer></v-spacer>

    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
};
</script>

<style module>
.title img {
  height: 3rem;
  margin-right: .75rem;
}
</style>
