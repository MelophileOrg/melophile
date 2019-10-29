<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <Features v-if="!inicialized"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import Features from '@/components/Home/Features.vue'

export default {
  name: 'home',
  components: {
    NavBar,
    Features,
  },
  methods: {

  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  async created() {

  }
}
</script>
