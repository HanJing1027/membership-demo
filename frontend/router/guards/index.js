import store from '../../store/index.js'

export function setupGuards(router) {
  // 簡化版守衛
  router.beforeEach((to, from) => {
    // 設置頁面標題
    document.title = to.meta.title

    // 權限驗證
    if (to.meta.requiresAuth) {
      const token = store.getters['auth/isAuthenticated']
      if (!token) {
        return { name: 'Login', query: { redirect: to.fullPath } }
      }
    }
  })
}
