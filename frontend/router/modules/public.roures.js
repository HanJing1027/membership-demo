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
    //
  },
]
