import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Experience from '@/views/Experience.vue'
import Research from '@/views/Research.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/experience',
      name: 'experience',
      component: Experience,
    },
    {
      path: '/research',
      name: 'research',
      component: Research,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

