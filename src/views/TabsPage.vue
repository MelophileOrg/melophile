<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="discover" href="/discover">
          <ion-icon :icon="triangle" />

          <ion-label>
            Discover
          </ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="browse" href="/browse">
          <ion-icon :icon="triangle" />

          <ion-label>
            Browse
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon :icon="triangle" />

          <ion-label>
            Search
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="radio" href="/radio">
          <ion-icon :icon="triangle" />

          <ion-label>
            Radio
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="library" href="/library">
          <ion-icon :icon="triangle" />

          <ion-label>
            Library
          </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
// Packages
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import {
  ellipse,
  square,
  triangle,
} from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabsPage',

  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },

  setup: () => ({
    ellipse, 
    square, 
    triangle,
  }),
});
</script>
