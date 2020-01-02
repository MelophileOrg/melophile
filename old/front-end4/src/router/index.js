import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/General/Home.vue'
import About from '../views/General/About.vue'
import Login from '../views/General/Login.vue'
import Authorize from '../views/General/Authorize.vue'
import PowerRecommends from '../views/General/PowerRecommends.vue'
import Search from '../views/General/Search.vue'

import Analysis from '../views/Library/Analysis.vue'
import Charts from '../views/Library/Charts.vue'
import Library from '../views/Library/Library.vue'
import Save from '../views/Library/Save.vue'

import PublicProfiles from '../views/Social/PublicProfiles.vue'
import Profile from '../views/Social/Profile.vue'
import MyProfile from '../views/Social/MyProfile.vue'

import SongAnalysis from '../views/Analysis/SongAnalysis.vue'
import ArtistAnalysis from '../views/Analysis/ArtistAnalysis.vue'
import GenreAnalysis from '../views/Analysis/GenreAnalysis.vue'
import PlaylistAnalysis from '../views/Analysis/PlaylistAnalysis.vue'

import MyMusicMood from '../views/Apps/MyMusicMood.vue'
import BoringRadar from '../views/Apps/BoringRadar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/about/:page',
    name: 'about',
    component: About
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/login/:path',
    name: 'login',
    component: Login
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: Authorize
  },
  {
    path: '/redirect/:path',
    name: 'redirect',
    component: Authorize
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: PowerRecommends
  },
  {
    path: '/recommend/:query',
    name: 'recommend',
    component: PowerRecommends
  },
  {
    path: '/library/analysis',
    name: 'libraryanalysis',
    component: Analysis
  },
  {
    path: '/library/charts',
    name: 'charts',
    component: Charts
  },
  {
    path: '/library',
    name: 'library',
    component: Library
  },
  {
    path: '/library/song/:id',
    name: 'librarysong',
    component: SongAnalysis
  },
  {
    path: '/library/artist/:id',
    name: 'libraryartist',
    component: ArtistAnalysis
  },
  {
    path: '/library/genre/:id',
    name: 'librarygenre',
    component: GenreAnalysis
  },
  {
    path: '/library/playlist/:id',
    name: 'libraryplaylist',
    component: PlaylistAnalysis
  },
  {
    path: '/library/save',
    name: 'librarysave',
    component: Save
  },
  {
    path: '/social/myprofile',
    name: 'myprofile',
    component: MyProfile
  },
  {
    path: '/social/profile/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: '/social',
    name: 'profiles',
    component: PublicProfiles
  },
  {
    path: '/social/:query',
    name: 'profiles',
    component: PublicProfiles
  },
  {
    path: '/apps/mymusicmood',
    name: 'mymusicmood',
    component: MyMusicMood
  },
  {
    path: '/apps/boringradar',
    name: 'boringradar',
    component: BoringRadar
  },
  {
    path: '/songs/:id',
    name: 'song',
    component: SongAnalysis
  },
  {
    path: '/artists/:id',
    name: 'artist',
    component: ArtistAnalysis
  },
  {
    path: '/genres/:id',
    name: 'genre',
    component: GenreAnalysis
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
