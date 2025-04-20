import store from '../../store/index.js'

export function authGuard(to, from) {
  if (to.meta.requiresAuth) {
    const token = store.getters['auth/isAuthenticated']
    if (!token) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }

  if (to.meta.guestOnly) {
    // 如果已經登入，則不允許訪問登入和註冊頁面
    const token = store.getters['auth/isAuthenticated']
    if (token) {
      return { name: 'Home' }
    }
  }
}
