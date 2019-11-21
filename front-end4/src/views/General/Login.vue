<template>
  <div id="main-flex" class="login">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/Navigation/NavBar.vue'

export default {
  name: 'login',
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
    this.$store.dispatch('inicializeGetToken');
  }
}
</script>