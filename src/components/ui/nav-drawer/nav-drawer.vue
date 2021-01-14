<template>
  <v-navigation-drawer
    :class="$style.component"
    app
    floating>
    <div :class="$style.logo">
      <logo />
    </div>

    <nav-drawer-tabs />
  </v-navigation-drawer>
</template>

<script>
import Logo from '~/components/ui/logo/logo';
import NavDrawerTabs from './components/nav-drawer-tabs';

export default {
  name: 'NavDrawer',
  components: {
    Logo,
    NavDrawerTabs,
  },
  data: () => ({
    clipped: false,
    drawer: false,
    items: [
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/'
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'Inspire',
        to: '/inspire'
      }
    ],
    miniVariant: false,
  })
}
</script>

<style module>
.component {
  background-color: var(--bg-3) !important;
}

.logo {
  display: flex;
  align-items: flex-end;
  margin: 3.1rem 0 5rem 2.5rem;
  cursor: pointer;
}
</style>
