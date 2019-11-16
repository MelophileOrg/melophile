<template>
  <div id="main-flex" class="about">
    <NavBar/>
    <div id="main">
      <Progress v-if="inicialized && progress.processed < progress.total"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'
import Progress from '@/components/General/Progress.vue'

export default {
  name: 'about',
  components: {
    NavBar,
    Progress
  },
  methods: {

  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    progress() {
      return this.$store.state.progress;
    }
  },
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>
