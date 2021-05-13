<template>
  <div
    v-if="user"
    class="elevation-8"
    :class="$style['profile-image']"
    :style="{
      backgroundImage: `url('${image}')`,
    }" />
  <div
    v-else
    class="elevation-8 loader"
    :class="$style['profile-image']"
    />
</template>

<script>
export default {
  name: 'ProfileImage',
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    image() {
      if (this.user) {
        return this.user.images[0].url;
      } 
      return '';
    },
  },
};
</script>

<style module>
.profile-image {
  background-position: center center;
  background-size: 100% auto;
  border: 3px solid rgba(116, 115, 115, 0.986);
  border-radius: 50%;
  height: 12rem;
  width: 12rem;
}
</style>
