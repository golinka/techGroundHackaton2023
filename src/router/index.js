import { createWebHistory, createRouter } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import AdminPage from '../views/AdminPage.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
