import axios from 'axios'
import Cookies from 'js-cookie'

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
      const response = await api.post('/api/logout')
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
}
