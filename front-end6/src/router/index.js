import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/General/Home.vue'
import About from '../views/General/About.vue'
import Authorize from '../views/General/Authorize.vue'

import Discover from '../views/Lists/Discover.vue'
import Library from '../views/Lists/Library.vue'
import Search from '../views/Lists/Search.vue'
//import TopCharts from '../views/Lists/TopCharts.vue'

import TopPlayed from '../views/Lists/TopPlayed.vue'
import TopSaved from '../views/Lists/TopSaved.vue'
import Extremes from '../views/Lists/Extremes.vue'

import MyProfile from '../views/Social/MyProfile.vue'
import Profile from '../views/Social/Profile.vue'
import PublicProfiles from '../views/Social/PublicProfiles.vue'

import AlbumAnalysis from '../views/Analysis/AlbumAnalysis.vue'
import ArtistAnalysis from '../views/Analysis/ArtistAnalysis.vue'
import BigPicture from '../views/Analysis/BigPicture.vue'
import GenreAnalysis from '../views/Analysis/GenreAnalysis.vue'
import TrackAnalysis from '../views/Analysis/TrackAnalysis.vue'
import PlaylistAnalysis from '../views/Analysis/PlaylistAnalysis.vue'

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
    path: '/redirect',
    name: 'redirect',
    component: Authorize
  },
  {
    path: '/redirect/:token',
    name: 'redirecttoken',
    component: Authorize
  },
  {
    path: '/discover',
    name: 'discover',
    component: Discover
  },
  {
    path: '/library',
    name: 'library',
    component: Library
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/library/charts/played',
    name: 'topplayed',
    component: TopPlayed
  },
  {
    path: '/library/charts/saved',
    name: 'topsaved',
    component: TopSaved
  },
  {
    path: '/library/charts/extremes',
    name: 'extremes',
    component: Extremes
  },
  {
    path: '/library/bigpicture',
    name: 'bigpicture',
    component: BigPicture
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
    path: '/social/public',
    name: 'publicprofiles',
    component: PublicProfiles
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
    path: '/track/:id',
    name: 'track',
    component: TrackAnalysis
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: PlaylistAnalysis
  },
  {
    path: '/genre/:id',
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
