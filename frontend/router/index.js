import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 配置頁面切換時的捲動行為
    return savedPosition || { top: 0 }
  },
})

// 全域導航守衛
router.beforeEach((to, from) => {
  //
})

router.beforeResolve((to, from) => {
  //
})

router.afterEach((to, from) => {
  //
})

export default router
