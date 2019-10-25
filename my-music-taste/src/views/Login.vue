<template>
  <div id="main-flex" class="login">
    <NavBar/>
    <div id="main">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'login',
  components: {
    NavBar
  },
}
</script>