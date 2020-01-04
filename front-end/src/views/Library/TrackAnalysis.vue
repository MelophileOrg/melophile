<template>
  <div class="TrackAnalysis">

  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'TrackAnalysis',
  components: {

  },
  data() {
      return {
          trackId: null,
      }
  }, 
  created() {
      this.trackId = this.$router.currentRoute.params.id;
  }
}
</script>