export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首頁',
      requiresAuth: false,
    },
  },
  {
    path: '/security-info',
    name: 'SecurityInfo',
    component: () => import('@/views/SecurityInfo.vue'),
    meta: {
      title: '安全保障',
      requiresAuth: false,
    },
  },
]
