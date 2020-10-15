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
            <h1 :class="{
              loader: name === '',
              [$style['primary-loader']]: name === '',
            }">
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

        <div>
          <slot name="tabs" />
        </div>
      </div>
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

.container {
  display: flex;
}

.content .wrapper {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.image {
  --size: 16rem;
  width: var(--size);
  height: var(--size);
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

.primary-loader {
  display: block;
  width: 16rem;
  height: 2.4rem;
  border-radius: .5rem;
  margin-bottom: 1rem;
}
</style>
