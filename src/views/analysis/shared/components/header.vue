<template>
  <v-card
    color="grey-2"
    :class="$style.component">
    <div :class="$style.container">
      <div
        class="elevation-6"
        :class="[$style.image, {
          loader: !image,
        }]"
        :style="{
          backgroundImage: `url('${image}')`,
        }" />

      <div :class="$style.content">
        <div :class="$style.wrapper">
          <div :class="$style.details">
            <p :class="$style.type">
              {{ type }}
            </p>

            <h1>
              {{ name }}
            </h1>

            <slot name="secondary" />
          </div>

          <div :class="$style.actions">
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div>
      <slot name="tabs" />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'AnalysisHeader',
  props: {
    image: {
      type: String,
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'TRACK',
    },
  },
}
</script>

<style module>
.component {
  margin-bottom: 2rem;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 20rem);
  flex-grow: 1;
}

p.type {
  text-transform: uppercase;
  color: var(--grey-6);
  font-size: 1.2rem;
  margin: 0;
}

.container {
  display: flex;
}

.content .wrapper {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.image {
  width: 14rem;
  height: 14rem;
  background-size: 100% 100%;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 2rem;
}

.actions {
  margin-right: 2rem;
  padding-top: 2rem;
}

.details h1 {
  color: white;
  font-weight: 300;
  font-size: 2.6rem;
}
</style>
