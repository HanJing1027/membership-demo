import axios from 'axios'

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
      const response = await axios.post('/api/register', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  // 登入
  login: async (userData) => {
    try {
      const response = await axios.post('/api/login', userData)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
}
