<template>
  <div id="main-flex" class="publicprofiles">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'

export default {
  name: 'publicprofiles',
  components: {
    NavBar
  },
  computed: {

  },
  created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
  }
}
</script>