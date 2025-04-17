import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { setupGuards } from './guards'

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
