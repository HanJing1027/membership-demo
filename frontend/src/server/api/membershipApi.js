import axios from 'axios'
import Cookies from 'js-cookie'
import store from '@/store/index.js'
import router from '@/router/index.js'

const api = axios.create()
const TOKEN_KEY = 'auth_token' // Cookie 名稱，用於存儲 JWT token，需與 auth.js 保持一致以確保系統各部分能正確存取相同的認證信息

// 登入、註冊不需要攜帶 JWT
const EXCLUDED_URLS = [
  '/api/login',
  '/api/register',
  '/api/forgot-password',
  '/api/verify',
  '/api/resendotp',
]

api.interceptors.request.use((config) => {
  // 請求的 URL 不在排除列表中就攜帶 JWT Token
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
      const isRefreshToken = error.response.config.url.includes('/api/refresh')

      if (isRefreshToken) {
        store.dispatch('auth/forceLogout')
        router.replace('/')
      }
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

  // 發送驗證 OTP 至註冊的 email
  verifyOtp: async (otpCode) => {
    try {
      const response = await api.post('/api/verify', otpCode)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 重送 OTP
  resendOtp: async (emailData) => {
    try {
      const response = await api.post('/api/resendotp', emailData)
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

  // 刷新 token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/refresh')
      const newToken = response.data.authorization.token

      // 刷新成功後立即更新 Cookie
      Cookies.set(TOKEN_KEY, newToken, {
        // secure: true, 開發用不到，部署到 HTTPS 再開啟
        sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
      })

      // 立即更新 axios 的請求頭
      api.defaults.headers['Authorization'] = `Bearer ${newToken}`

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

  // 忘記密碼 (發送重設密碼的 email)
  forgotPassword: async (emailData) => {
    try {
      const response = await api.post('/api/forgotPassword', emailData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 重設密碼
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/api/resetPassword', resetData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 獲取使用者資料
  getUserData: async () => {
    try {
      const response = await api.get('/api/userData')
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 修改使用者資料
  editingUserData: async (userData) => {
    try {
      const response = await api.post('/api/updateUserData', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 修改用戶頭像
  uploadAvatar: async (formData) => {
    try {
      const response = await api.post('/api/updateAvatar', formData, {
        transformRequest: null,
      })
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
  updatePassword: async (userData) => {
    try {
      const response = await api.post('/api/updatePassword', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
}
