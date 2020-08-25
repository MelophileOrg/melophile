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
    path: '/user/:id',
    name: 'Profile',
    component: () => import('../views/profile/profile.vue'),
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: () => import('../views/search/search.vue'),
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/library/library.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/history/history.vue'),
  },
  {
    path: '/history/:year',
    name: 'Year',
    component: () => import('../views/history/year.vue'),
  },
  {
    path: '/history/:year/:month',
    name: 'Month',
    component: () => import('../views/history/month.vue'),
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('../views/discover/discover.vue'),
  },
  {
    path: '/auth',
    name: 'Callback',
    component: () => import('../views/callback/callback.vue'),
  },
  {
    path: '/track/:id',
    name: 'Track',
    component: () => import('../views/analysis/track/track.vue'),
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: () => import('../views/analysis/playlist/playlist.vue'),
  },
  {
    path: '/genre/:id',
    name: 'Genre',
    component: () => import('../views/analysis/genre/genre.vue'),
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: () => import('../views/analysis/artist/artist.vue'),
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: () => import('../views/analysis/album/album.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
