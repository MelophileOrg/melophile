import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import About from './views/About.vue'
import AppPreview from './views/AppPreview.vue'

import SongAnalysis from './views/SongAnalysis'
import MusicMood from './views/MusicMood'
import MyCharts from './views/MyCharts'
import LibraryAnalysis from './views/LibraryAnalysis'

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
      path: '/token/:access_token',
      name: 'token',
      component: Login,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/app/:app/preview',
      name: 'apppreview',
      component: AppPreview
    },
    {
      path: '/songanalysis',
      name: 'songanalysis',
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
  ]
})
