export default [
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
