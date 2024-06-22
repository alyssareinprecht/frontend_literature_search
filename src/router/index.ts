import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LiteratureSearch from '@/views/LiteratureSearch.vue';
import WordClouds from '../views/WordClouds.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/literature-search',
    name: 'literature-search',
    component: LiteratureSearch,
  },
  {
    path: '/word-cloud/:title',
    name: 'word-cloud',
    component: WordClouds,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;