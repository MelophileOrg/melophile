import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Authorize from '../views/Authorize.vue'

import Home from '../views/Home.vue'
import About from '../views/About.vue'

import Library from '../views/Library/Library.vue'

import SongAnalysis from '../views/Analysis/SongAnalysis.vue'
import GenreAnalysis from '../views/Analysis/GenreAnalysis.vue'
import ArtistAnalysis from '../views/Analysis/ArtistAnalysis.vue'

import MyProfile from '../views/Social/MyProfile.vue'
import Profile from '../views/Social/Profile.vue'
import PublicProfiles from '../views/Social/PublicProfiles.vue'
import SaveLibrary from '../views/Social/SaveLibrary.vue'

import SearchSongs from '../views/SearchSongs.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/redirect',
    name: 'authorize',
    component: Authorize,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/songs/:id',
    name: 'song',
    component: SongAnalysis,
  },
  {
    path: '/genres/:id',
    name: 'genre',
    component: GenreAnalysis,
  },
  {
    path: '/artists/:id',
    name: 'artist',
    component: ArtistAnalysis,
  },
  {
    path: '/library',
    name: 'library',
    component: Library,
  },
  {
    path: '/social/profile/:id',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/social/myprofile',
    name: 'myprofile',
    component: MyProfile,
  },
  {
    path: '/social/public',
    name: 'public',
    component: PublicProfiles,
  },
  {
    path: '/social/save',
    name: 'save',
    component: SaveLibrary,
  },
  {
    path: '/songs',
    name: 'search',
    component: SearchSongs,
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
