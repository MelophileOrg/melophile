import Vue from 'vue';
import Router from 'vue-router';

import Landing from './pages/landing/landing.vue';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Landing,
      },
    ],
  });
}
