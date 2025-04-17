export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登入',
      layout: 'guest',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '註冊',
      layout: 'guest',
      guestOnly: true,
    },
  },
]
