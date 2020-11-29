<template>
  <v-lazy
    transition="fade-transition"
    :options="{
      threshold: .5
    }">
    <div :class="$style.component">
      <img
        v-if="image"
        :src="image" />

      <div :class="$style.content">
        <span
          :class="[$style.name, $style.link]"
          @click="routePrimary">
          {{ name }}
        </span>

        <div :class="$style.secondaries">
          <span
            v-for="(secondary, index) in secondaries"
            :key="secondary.id"
            :class="[$style.secondary,
              {
                [$style.link]: type !== 'artist',
              }
            ]"
            @click="routeSecondary(index)">
            {{ secondary.name }}{{ index !== secondaries.length - 1 ? ',' : ''}}
          </span>
        </div>
      </div>
    </div>
  </v-lazy>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'track',
    },
  },
  computed: {
    defined() {
      return 'id' in this.item;
    },
    image() {
      if (this.defined) {
        if (this.type === 'track') {
          return this.item.album.images[0].url;
        } if ([
          'artist',
          'album',
          'playlist',
        ].includes(this.type)) {
          return this.item.images[0].url;
        }
      }
      return null;
    },
    name() {
      if (this.defined) {
        return this.item.name;
      }
      return null;
    },
    secondaries() {
      if (this.defined) {
        if ([
          'track',
          'album',
        ].includes(this.type)) {
          return this.item.artists.map((artist) => ({ name: artist.name, id: artist.id }));
        } if (this.type === 'artist') {
          return this.item.followers.total;
        } if (this.type === 'playlist') {
          return this.item.owner.display_name;
        }
      }
      return null;
    },
  },
  methods: {
    routePrimary() {
      this.$router.push(`/${this.type}/${this.item.id}`);
    },
    routeSecondary(index) {
      if ([
        'track',
        'album',
      ].includes(this.type)) {
        this.$router.push(`/artist/${this.item.artists[index].id}`);
      } else if (this.type === 'playlist') {
        this.$router.push(`/user/${this.item.owner.id}`);
      }
    },
  },
};
</script>

<style module>
.component {
  display: flex;
  background-color: var(--grey-10);
  padding: 1rem;
  border-radius: 1rem;
  margin: .5rem 0;
}

.component img {
  --size: 4rem;
  width: var(--size);
  height: var(--size);
  margin-right: 1.5rem;
  border-radius: .5rem;
  border: 1px solid rgb(236, 236, 236);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content span {
  display: inline-block;
  font-size: 1.2rem;
  padding: 0;
}

.content span.link:hover {
  cursor: pointer;
  text-decoration: underline;
}

.content span.name {
  color: var(--title);
  font-weight: 600;
}

.secondaries {
  display: flex;
}

.secondaries span {
  margin-right: .5rem;
}
</style>
