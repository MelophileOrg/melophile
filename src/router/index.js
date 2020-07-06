import Vue from 'vue';
import VueRouter from 'vue-router';
import Landing from '../views/general/Landing.vue';
import Home from '../views/general/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth',
    name: 'Redirect',
    component: () => import('../views/general/Redirect.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
