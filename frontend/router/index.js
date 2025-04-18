import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import { setupGuards } from './guards/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition || { top: 0 }
  },
})

// 設置路由守衛
setupGuards(router)

export default router
