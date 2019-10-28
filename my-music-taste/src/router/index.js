import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Authorize from '../views/Authorize.vue'

import Home from '../views/Home.vue'
import About from '../views/About.vue'

import MyLibrary from '../views/MyLibrary.vue'
import SaveLibrary from '../views/SaveLibrary.vue'

import MyCharts from '../views/MyCharts.vue'
import MyArtists from '../views/MyArtists.vue'
import MyGenres from '../views/MyGenres.vue'
import MyCharacteristics from '../views/MyCharacteristics.vue'

import SongAnalysis from '../views/SongAnalysis.vue'
import ArtistAnalysis from '../views/ArtistAnalysis.vue'
import GenreAnalysis from '../views/GenreAnalysis.vue'

import PublicProfiles from '../views/PublicProfiles.vue'
import Profile from '../views/Profile.vue'
import MyProfile from '../views/MyProfile.vue'

import PowerRecommends from '../views/PowerRecommends.vue'
import Recommend from '../views/Recommend.vue'

import BoringRadar from '../views/BoringRadar.vue'

import Test from '../views/Test.vue'

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
    component: About
  },
  {
    path: '/library',
    name: 'library',
    component: MyLibrary
  },
  {
    path: '/library/save',
    name: 'save',
    component: SaveLibrary
  },
  {
    path: '/mycharts',
    name: 'charts',
    component: MyCharts
  },
  {
    path: '/myartists',
    name: 'artists',
    component: MyArtists
  },
  {
    path: '/mygenres',
    name: 'genres',
    component: MyGenres
  },
  {
    path: '/mycharacteristics',
    name: 'characteristics',
    component: MyCharacteristics
  },
  {
    path: '/song',
    name: 'songs',
    component: SongAnalysis
  },
  {
    path: '/song/:id',
    name: 'song',
    component: SongAnalysis
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: ArtistAnalysis
  },
  {
    path: '/genre/:genre',
    name: 'genre',
    component: GenreAnalysis
  },
  {
    path: '/profiles',
    name: 'profiles',
    component: PublicProfiles
  },
  {
    path: '/profile/:id',
    name: 'myprofile',
    component: MyProfile
  },
  {
    path: '/profiles/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: '/powerrecommends',
    name: 'powerrecommends',
    component: PowerRecommends
  },
  {
    path: '/powerrecommends/:details',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/boringradar',
    name: 'boringradar',
    component: BoringRadar
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
