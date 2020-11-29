import Vue from 'vue';
import VueRouter from 'vue-router';

import Landing from '../views/landing/Landing.vue';
import Feed from '../views/feed/Feed.vue';

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
    component: () => import('../views/profile/Profile.vue'),
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: () => import('../views/search/Search.vue'),
  },
  {
    path: '/library/tracks',
    name: 'Tracks',
    component: () => import('../views/library/Tracks.vue'),
  },
  {
    path: '/library/artists',
    name: 'Artists',
    component: () => import('../views/library/Artists.vue'),
  },
  {
    path: '/library/albums',
    name: 'Albums',
    component: () => import('../views/library/Albums.vue'),
  },
  {
    path: '/library/playlists',
    name: 'Playlists',
    component: () => import('../views/library/Playlists.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/history/History.vue'),
  },
  {
    path: '/history/:year',
    name: 'Year',
    component: () => import('../views/history/Year.vue'),
  },
  {
    path: '/history/:year/:month',
    name: 'Month',
    component: () => import('../views/history/Month.vue'),
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('../views/discover/Discover.vue'),
  },
  {
    path: '/auth',
    name: 'Callback',
    component: () => import('../views/callback/Callback.vue'),
  },
  {
    path: '/track/:id',
    name: 'Track',
    component: () => import('../views/analysis/track/Track.vue'),
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: () => import('../views/analysis/playlist/Playlist.vue'),
  },
  {
    path: '/genre/:id',
    name: 'Genre',
    component: () => import('../views/analysis/genre/Genre.vue'),
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: () => import('../views/analysis/artist/Artist.vue'),
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: () => import('../views/analysis/album/Album.vue'),
  },
  {
    path: '/charts/me',
    name: 'Charts',
    component: () => import('../views/charts/Charts.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
