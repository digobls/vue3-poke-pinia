import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListView from '../views/ListView.vue';
import DetailView from '../views/DetailView.vue';

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'home'
  },
  {
    path: '/list',
    component: ListView,
    name: 'list'
  },
  {
    path: '/detail/:idPokemon',
    component: DetailView,
    name: 'detail'
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: routes
});

export default router
