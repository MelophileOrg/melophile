<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1 :class="$style.title">
        Your Top Charts
      </h1>

      <div :class="$style.actions">
        <v-btn
          icon
          dark>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </div>
    </div>

    <div :class="$style.background">
      <img src="../../../../assets/graphics/charts.svg" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChartHeader',
  data: () => ({
  }),
  methods: {

  },
};
</script>

<style module>
.component {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding: 5rem 0;
  max-height: 50rem;
  height: 30vh;
  position: relative;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #111111;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

.background img {
  height: 100%;
  min-height: 45rem;
}

.content {
  width: calc(100% - 8rem);
  max-width: 130rem;
  margin: 0 auto;
  z-index: 2;
}

.title {
  font-size: 5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.096);
}

.actions {
  display: flex;
  align-items: center;
}
</style>
