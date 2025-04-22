import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../../../store/index.js'
import router from '../../../router/index.js'

const api = axios.create()
const TOKEN_KEY = 'auth_token' // 需要和 auth.js 中使用的常數一致

// 登入、註冊不需要攜帶 JWT
const EXCLUDED_URLS = ['/api/login', '/api/register']

api.interceptors.request.use((config) => {
  // 請求的 URL 不在排除列表中就攜帶 JWT
  if (!EXCLUDED_URLS.includes(config.url)) {
    const token = Cookies.get(TOKEN_KEY)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('auth/forceLogout')
      // 這裡可以加入跳轉到登入頁的邏輯
      router.replace('/')
    }
    return Promise.reject(error)
  }
)

const handleError = (error) => {
  if (error.response) {
    console.error('回應狀態:', error.response.status)
    console.error('回應資料:', error.response.data)
  }
}

export const membershipApi = {
  // 註冊
  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 登入
  login: async (userData) => {
    try {
      const response = await api.post('/api/login', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 登出
  logout: async () => {
    try {
      await api.post('/api/logout')
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 刷新 token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/refresh')
      return response.data
    } catch (error) {
      // handleError(error)
      // throw error
    }
  },

  // 重送 OTP
  resendOtp: async (email) => {
    try {
      const response = await api.post('/api/resend-otp', email)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  sendOtp: async (otpCode) => {
    try {
      const response = await api.post('/api/send-otp', otpCode)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
}
