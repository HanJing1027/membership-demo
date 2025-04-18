import store from '../../store/index.js'

export function authGuard(to, from) {
  if (to.meta.requiresAuth) {
    const token = store.getters['auth/isAuthenticated']
    if (!token) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }
}
