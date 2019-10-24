import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Redirect from './views/Redirect.vue'
import About from './views/About.vue'

import SongAnalysis from './views/SongAnalysis'
import MusicMood from './views/MusicMood'
import MyCharts from './views/MyCharts'
import LibraryAnalysis from './views/LibraryAnalysis'
import Boring from './views/Boring'
import PowerRecommends from './views/PowerRecommends'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: Redirect,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/songanalysis',
      name: 'songanalysis',
      component: SongAnalysis
    },
    {
      path: '/songanalysis/:trackId',
      name: 'songanalysisSENT',
      component: SongAnalysis
    },
    {
      path: '/mymusicmood',
      name: 'mymusicmood',
      component: MusicMood
    },
    {
      path: '/mycharts',
      name: 'mycharts',
      component: MyCharts
    },
    {
      path: '/libraryanalysis',
      name: 'libraryanalysis',
      component: LibraryAnalysis
    },
    {
      path: '/boring',
      name: 'boring',
      component: Boring
    },
    {
      path: '/recommends',
      name: 'recommends',
      component: PowerRecommends
    },
  ]
})
