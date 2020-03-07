<template>
  <div class="Features">
    <FeaturesTotal/>
    <FeaturesLibraryAnalysis/>
  </div>
</template>

<script>
import FeaturesTotal from '@/components/Home/FeaturesTotal.vue'
import FeaturesLibraryAnalysis from '@/components/Home/FeaturesLibraryAnalysis.vue'

export default {
  name: 'Features',
  components: {
      FeaturesTotal,
      FeaturesLibraryAnalysis
  },
  data() {
      return {
          
      }
  },
  watch: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
