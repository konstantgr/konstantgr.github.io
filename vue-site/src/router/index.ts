import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Experience from '@/views/Experience.vue'
import Research from '@/views/Research.vue'
import Blog from '@/views/Blog.vue'
import BlogPost from '@/views/BlogPost.vue'

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
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost,
      props: true,
    },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { top: 0 }
  },
})

export default router
