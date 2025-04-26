export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登入',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '註冊',
      guestOnly: true,
    },
  },
  {
    path: '/otp-form',
    name: 'OtpForm',
    component: () => import('@/views/OtpForm.vue'),
    meta: {
      title: '驗證碼',
      guestOnly: true,
      otpOnly: true,
    },
  },
  {
    path: '/register/success',
    name: 'RegisterSuccess',
    component: () => import('@/views/RegisterSuccess.vue'),
    meta: {
      title: '註冊成功',
      guestOnly: true,
      RegistrationProcessRequired: true, // 需要註冊流程
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: {
      title: '忘記密碼',
      guestOnly: true,
    },
  },
]
