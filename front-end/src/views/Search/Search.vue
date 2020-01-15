<template>
  <div class="Search">
    <div class="spacing">
    <v-text-field class="input" prepend-icon="fa-search" :autofocus="true" :dark="true"  background-color="rgba(100,100,100,.15)" solo placeholder="Search..."></v-text-field>
    </div>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Search',
  components: {

  },
}
</script>

<style scoped>
.spacing {
  width: 100%;
  height: 100%;
  padding: 20px 48px;
}

.input {
  font-size: 20px;
}

</style>