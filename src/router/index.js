import Vue from 'vue';
import VueRouter from 'vue-router';

import Landing from '../views/landing/landing.vue';
import Feed from '../views/feed/feed.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/feed',
    name: 'Feed',
    component: Feed,
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/profile/profile.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
