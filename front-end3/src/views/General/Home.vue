<template>
  <div id="main-flex" class="home">
    <NavBar/>
    <div id="main">
      <Features/>
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
    save() {
      this.$router.push('/social/save');
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
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
