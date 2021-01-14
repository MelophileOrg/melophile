<template>
  <v-app>
    <public-app-bar />

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import PublicAppBar from '~/components/ui/app-bar/public-app-bar';

export default {
  components: {
    PublicAppBar,
  },
}
</script>

<style module>
.logo {
  align-items: center;
  display: flex;
}

.logo h1 {
  margin: 0;
}
</style>
