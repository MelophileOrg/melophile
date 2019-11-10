<template>
  <div id="main-flex" class="authorize">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'

export default {
  name: 'authorize',
  components: {
    NavBar,
  },
  methods: {

  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    }
  },
  async created() {
    await this.$store.dispatch('inicializeParseToken');
    if (this.$store.state.inicialized)
      this.$store.dispatch('loadLibrary');
    this.$router.push('/');
  }
}
</script>