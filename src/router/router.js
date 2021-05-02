import { createWebHistory, createRouter } from 'vue-router'
import Profile from '@/pages/Profile.vue'
import MapView from '@/pages/MapView.vue'
import Stats from '@/pages/Stats.vue'

const history = createWebHistory()
const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      component: Profile,
    },
    {
      path: '/map',
      component: MapView,
    },
    {
      path: '/stats',
      component: Stats,
    },
  ],
})

export default router
