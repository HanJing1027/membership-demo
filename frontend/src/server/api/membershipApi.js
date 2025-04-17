import axios from 'axios'

export const membershipApi = {
  // 註冊
  register: async (userData) => {
    try {
      const response = await axios.post('backend/api/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 登入
}
