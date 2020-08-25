<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1>
        {{ title }}
      </h1>

      <span v-if="action">
        {{ action }}
      </span>
    </div>

    <v-divider />
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: {
      type: String,
      default: null,
    },

    action: {
      type: String,
      default: null,
    },
  },
  methods: {
    handle() {
      this.$emit('action');
    },
  },
};
</script>

<style module>
.component {
  margin-bottom: 1rem;
}

.content {
  display: flex;
  align-items: center;
  margin-bottom: .4rem;
}

.content span {
  cursor: pointer;
  color: var(--grey-5);
  font-size: 1.3rem;
  margin-left: 1rem;
}

.content span:hover {
  text-decoration: underline;
}
</style>