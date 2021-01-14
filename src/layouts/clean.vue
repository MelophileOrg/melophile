<template>
  <v-app>
    <public-app-bar :disableLogin="true" />

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
