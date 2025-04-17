import authRoutes from './modules/auth.routes'

// 創建臨時的用戶中心路由
const userRoutes = [
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('@/views/UserCenter.vue'),
    meta: {
      title: '會員中心',
      requiresAuth: true,
    },
  },
]

const errorRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Home.vue'),
    meta: { title: '頁面不存在' },
  },
]

export default [...authRoutes, ...userRoutes, ...errorRoutes]
