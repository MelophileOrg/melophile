import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Redirect from '../views/Redirect.vue'

import About from '../views/About/About.vue'
import Contribute from '../views/About/Contribute.vue'
import Development from '../views/About/Development.vue'
import FuturePlans from '../views/About/FuturePlans.vue'

import TopPlayed from '../views/Charts/TopPlayed.vue'
import TopSaved from '../views/Charts/TopSaved.vue'
import Extremes from '../views/Charts/Extremes.vue'

import History from '../views/History/History.vue'
import Month from '../views/History/Month.vue'
import Year from '../views/History/Year.vue'

import Album from '../views/Library/Album.vue'
import Overview from '../views/Library/Overview.vue'
import Artist from '../views/Library/Artist.vue'
import Genre from '../views/Library/Genre.vue'
import Library from '../views/Library/Library.vue'
import Playlist from '../views/Library/Playlist.vue'
import Track from '../views/Library/Track.vue'

import Discover from '../views/Search/Discover.vue'
import Search from '../views/Search/Search.vue'

import Profile from '../views/Social/Profile.vue'
import PublicProfiles from '../views/Social/PublicProfiles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/redirect/',
    name: 'redirect',
    component: Redirect
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/about/contribute',
    name: 'contribute',
    component: Contribute
  },
  {
    path: '/about/development',
    name: 'development',
    component: Development
  },
  {
    path: '/about/futureplans',
    name: 'futureplans',
    component: FuturePlans
  },
  {
    path: '/charts/topplayed',
    name: 'topplayed',
    component: TopPlayed
  },
  {
    path: '/charts/topsaved',
    name: 'topsaved',
    component: TopSaved
  },
  {
    path: '/charts/extremes',
    name: 'extremes',
    component: Extremes
  },
  {
    path: '/history',
    name: 'history',
    component: History
  },
  {
    path: '/history/:month/:year',
    name: 'month',
    component: Month
  },
  {
    path: '/history/:year',
    name: 'year',
    component: Year
  },
  {
    path: '/library',
    name: 'library',
    component: Library
  },
  {
    path: '/library/overview',
    name: 'overview',
    component: Overview
  },
  {
    path: '/album/:id',
    name: 'album',
    component: Album
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: Artist
  },
  {
    path: '/genre/:id',
    name: 'genre',
    component: Genre
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: Playlist
  },
  {
    path: '/track/:id',
    name: 'track',
    component: Track
  },
  {
    path: '/search/:query',
    name: 'search',
    component: Search
  },
  {
    path: '/discover',
    name: 'discover',
    component: Discover
  },
  {
    path: '/social/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: '/social',
    name: 'publicprofiles',
    component: PublicProfiles
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
