import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Redirect from '../views/Redirect.vue'

import About from '../views/About/About.vue'
import Contribute from '../views/About/Contribute.vue'
import Development from '../views/About/Development.vue'
import FuturePlans from '../views/About/FuturePlans.vue'

import Charts from '../views/Charts/Charts.vue'

import History from '../views/History/History.vue'
import MonthAnalysis from '../views/History/MonthAnalysis.vue'
import YearAnalysis from '../views/History/YearAnalysis.vue'

import Library from '../views/Library/Library.vue'
import AlbumAnalysis from '../views/Library/AlbumAnalysis.vue'
import ArtistAnalysis from '../views/Library/ArtistAnalysis.vue'
import GenreAnalysis from '../views/Library/GenreAnalysis.vue'
import LibraryAnalysis from '../views/Library/LibraryAnalysis.vue'
import PlaylistAnalysis from '../views/Library/PlaylistAnalysis.vue'
import TrackAnalysis from '../views/Library/TrackAnalysis.vue'

import Search from '../views/Search/Search.vue'
import Discover from '../views/Search/Discover.vue'

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
    path: '/charts',
    name: 'charts',
    component: Charts
  },
  {
    path: '/history',
    name: 'history',
    component: History
  },
  {
    path: '/history/:month/:year',
    name: 'monthanalysis',
    component: MonthAnalysis
  },
  {
    path: '/history/:year',
    name: 'yearanalysis',
    component: YearAnalysis
  },
  {
    path: '/library',
    name: 'library',
    component: Library
  },
  {
    path: '/library/analysis',
    name: 'libraryanalysis',
    component: LibraryAnalysis
  },
  {
    path: '/album/:id',
    name: 'album',
    component: AlbumAnalysis
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: ArtistAnalysis
  },
  {
    path: '/genre/:id',
    name: 'genre',
    component: GenreAnalysis
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: PlaylistAnalysis
  },
  {
    path: '/track/:id',
    name: 'track',
    component: TrackAnalysis
  },
  {
    path: '/search',
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
