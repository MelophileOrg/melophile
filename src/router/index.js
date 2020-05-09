import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/index.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('../views/social/profile/Me.vue')
  },
  {
    path: '/user/:id',
    name: 'Profile',
    component: () => import('../views/social/profile/index.vue')
  },
  {
    path: '/user/:id/charts/extremes',
    name: 'Extremes',
    component: () => import('../views/charts/extremes/index.vue')
  },
  {
    path: '/user/:id/charts/top-played',
    name: 'TopPlayed',
    component: () => import('../views/charts/top-played/index.vue')
  },
  {
    path: '/user/:id/charts/top-saved',
    name: 'TopSaved',
    component: () => import('../views/charts/top-saved/index.vue')
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: () => import('../views/browse/search/index.vue')
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('../views/browse/discover/index.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/library/index.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/history/index.vue')
  },
  {
    path: '/history/:year',
    name: 'Year',
    component: () => import('../views/history/year/index.vue')
  },
  {
    path: '/history/:year/:month',
    name: 'Month',
    component: () => import('../views/history/month/index.vue')
  },
  {
    path: '/track/:id',
    name: 'Track',
    component: () => import('../views/analysis/track/index.vue')
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: () => import('../views/analysis/artist/index.vue')
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: () => import('../views/analysis/album/index.vue')
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: () => import('../views/analysis/playlist/index.vue')
  },
  {
    path: '/genre/:id',
    name: 'Genre',
    component: () => import('../views/analysis/genre/index.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
