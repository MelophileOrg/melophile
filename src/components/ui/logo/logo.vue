<template>
  <div
    :class="$style.logo"
    @click="goHome">
    <img src="~/assets/images/logo/logo-48.svg" />

    <span>
      Melophile
    </span>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  methods: {
    goHome() {
      if (this.$route.fullPath !== '/') {
        this.$router.push('/');
      }
    },
  },
}
</script>

<style module>
.logo {
  align-items: center;
  display: flex;
  height: 100%;
  cursor: pointer;
}

.logo img {
  height: 3rem;
}

.logo span {
  color: var(--txt-1);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 1.8rem;
  letter-spacing: -.032rem;
  margin-left: 1rem;
}
</style>
