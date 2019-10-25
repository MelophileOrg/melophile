<template>
  <div id="main-flex" class="authorize">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'authorize',
  components: {
    NavBar
  }
}
</script>