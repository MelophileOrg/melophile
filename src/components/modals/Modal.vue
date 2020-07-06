<template>
  <v-overlay
    :absolute="true"
    :value="show">
    <div class="close-container">
      <v-btn
        class="close"
        color="white"
        :icon="true"
        @click="hide">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </div>

    <v-card>
      <slot name="content"/>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  class: 'Modal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hide() {
      this.$emit('hide');
    },
  },
};
</script>

<style scoped>
.close-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
</style>
