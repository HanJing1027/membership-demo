import { titleGuard } from './titleGuard.js'
import { authGuard } from './authGurd.js'

export function setupGuards(router) {
  router.beforeEach(titleGuard)

  router.beforeEach(authGuard)
}
