import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import About from './views/About.vue'

import SA_Home from './views/SongAnalysis/SA_Home'
import SA_Data from './views/SongAnalysis/SA_Data'

import MMM_Home from './views/MyMusicMood/MMM_Home'
import MMM_Results from './views/MyMusicMood/MMM_Results'

import MC_Home from './views/MyCharts/MC_Home'
import MC_Chart from './views/MyCharts/MC_Chart'

import LA_Home from './views/LibraryAnalysis/LA_Home'
import LA_Search from './views/LibraryAnalysis/LA_Search'

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
      path: '/token/:access_token',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/songanalysis',
      name: 'songanalysis',
      component: SA_Home
    },
    {
      path: '/songanalysis/data',
      name: 'run-songanalysis',
      component: SA_Data
    },
    {
      path: '/mymusicmood',
      name: 'mymusicmood',
      component: MMM_Home
    },
    {
      path: '/mymusicmood/results',
      name: 'run-mymusicmood',
      component: MMM_Results
    },
    {
      path: '/mycharts',
      name: 'mycharts',
      component: MC_Home
    },
    {
      path: '/mycharts/charts',
      name: 'run-mycharts',
      component: MC_Chart
    },
    {
      path: '/libraryanalysis',
      name: 'libraryanalysis',
      component: LA_Home
    },
    {
      path: '/libraryanalysis/search',
      name: 'run-libraryanalysis',
      component: LA_Search
    },
  ]
})
