<template>
  <v-tabs
    v-model="tab"
    :class="$style.component"
    background-color="transparent"
    class="nav-drawer-tabs"
    color="pink"
    slider-size="3"
    vertical
    dense>
    <template v-for="tab in tabs">
      <v-tab
        v-if="tab.type === 'link'"
        :key="`nav-drawer-tab-${tab.text}`"
        :class="$style.tab"
        :to="tab.path"
        :nuxt="true">
        <v-icon>{{ tab.icon }}</v-icon>
        {{ tab.text }}
      </v-tab>

      <h6
        v-if="tab.type === 'category'"
        :key="`nav-drawer-tab-${tab.text}`">
        {{ tab.text }}
      </h6>
    </template>
  </v-tabs>
</template>

<script>
import tabs from '../config/tabs';

export default {
  name: 'NavDrawerTabs',
  data: () => ({
    tabs: tabs,
    tab: '/feed',
  }),
  created() {
    this.tab = this.$route.path;
  },
}
</script>

<style lang="scss" scoped>
.nav-drawer-tabs .v-tab {
  justify-content: start;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.2rem;
  letter-spacing: .024rem;
  line-height: 1.8rem;
  text-transform: none;
  padding: 0 0 0 1.2rem;
}

.nav-drawer-tabs .v-tab .v-icon {
  margin: 0 2.5rem 0 1.2rem;
}
</style>

<style lang="scss" module>
@import '~/assets/styles/config.scss';

.component h6 {
  @include themed() {
    color: theme($text-1);
  }

  padding: 4.8rem 0 1.8rem 2.4rem;
}

.component h6:nth-of-type(1) {
  padding: 0 0 1.8rem 2.4rem;
}
</style>
