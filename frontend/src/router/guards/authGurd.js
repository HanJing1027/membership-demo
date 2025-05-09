import store from '@/store/index.js'

export function authGuard(to, from) {
  const token = store.getters['auth/isAuthenticated']
  if (to.meta.requiresAuth) {
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

  // otp 流程守衛
  if (to.meta.otpOnly && !sessionStorage.getItem('registerEmail')) {
    return { name: 'Register' }
  }

  // 註冊流程守衛
  if (to.meta.RegistrationProcessRequired) {
    const isFromOtpPage = from.name === 'OtpForm'

    if (!isFromOtpPage) {
      return { name: 'Register' }
    }
  }

  if (to.meta.forgotPasswordProcessRequired) {
    const isForgotPasswordPage = from.name === 'ForgotPassword'

    if (!isForgotPasswordPage) {
      return { name: 'Home' }
    }
  }

  if (to.meta.resetPasswordProcessRequired) {
    if (to.query.token) {
      sessionStorage.setItem('resetPasswordToken', to.query.token)
    }

    if (!sessionStorage.getItem('resetPasswordToken')) {
      return { name: 'ForgotPassword' }
    }
  }
}
