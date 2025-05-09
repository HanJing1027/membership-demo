import authRoutes from './modules/auth.routes.js'
import userRoutes from './modules/user.routes.js'
import publicRoutes from './modules/public.roures.js'

const errorRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      title: '頁面不存在',
      requiresAuth: false,
    },
  },
]

export default [...publicRoutes, ...authRoutes, ...userRoutes, ...errorRoutes]
