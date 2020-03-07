<template>
  <div class="History content-padding-hori">
    <div class="page-title-bar slide-up elevation-3" :style="{'--delay': + 0}">
      <div class="page-title-icon history-icon"/>
      <h1 class="page-title">Your History</h1>
    </div>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'History',
  components: {

  },
}
</script>

<style scoped>
.history-icon {
  background-image: url('../../assets/nav-bar-icons/history.svg');
}
</style>