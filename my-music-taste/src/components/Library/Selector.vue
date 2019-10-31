<template>
  <div class="selector">
    <div v-for="(item, index) in items" :key="index">
      <h1 class="text" v-if="item.type == 'text'">{{item.text}}</h1>
      <Select class="select" @selection="selection" @pending="pending" v-if="item.type == 'select'" :options="item.options" :load="load" :setTitle="item.setTitle" :override="override"/>
    </div>
  </div>
</template>

<script>
import Select from '@/components/General/Select.vue'

export default {
  name: 'selector',
  components: {
    Select
  },
  props: {
    items: Array,
    load: Boolean, 
    override: Boolean,
  },
  methods: {
    selection(item) {
      this.$emit('selection', item);
    },
    pending() {
      this.$emit('pending');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.selector {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  flex-wrap: wrap;
  animation: slide-up .3s ease .2s, hide .2s linear;
}

.select {
  margin: 0px 10px;
}

.text {
  font-size: 2.5em;
  color: rgba(255, 255, 255, 0.247);
  margin: 0;
  margin-right: 5px;
  text-transform: lowercase;
  font-weight: lighter;
}
</style>