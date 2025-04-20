import Cookies from 'js-cookie'
import { membershipApi } from '../../src/server/api/membershipApi'

// cookie 設定
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export default {
  namespaced: true,

  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // 強制轉為布林值進行判斷
    currentUser: (state) => state.user,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    REMOVE_AUTH(state) {
      state.user = null
      state.token = null
    },
  },

  actions: {
    // 登入後儲存用戶資料
    login(context, { token, username }) {
      context.commit('SET_TOKEN', token)
      context.commit('SET_USER', username)

      // 設定 cookie
      Cookies.set(TOKEN_KEY, token, {
        // secure: true, 開發用不到，部署到 HTTPS 再開啟
        sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
      })
      Cookies.set(USER_KEY, username, {
        // secure: true, 開發用不到，部署到 HTTPS 再開啟
        sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
      })
    },

    // 初始化狀態 (從 cookie 取出 token)
    async initAuth(context) {
      const token = Cookies.get(TOKEN_KEY)
      const username = Cookies.get(USER_KEY)

      context.commit('SET_TOKEN', token)
      context.commit('SET_USER', username)

      // refresh token
      try {
        if (!token) return

        const response = await membershipApi.refreshToken()
        const newToken = response.authorization.token

        // 使用新的 token 更新狀態
        context.commit('SET_TOKEN', newToken)

        // 更新 cookie 新 token
        Cookies.set(TOKEN_KEY, newToken, {
          // secure: true, 開發用不到，部署到 HTTPS 再開啟
          sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
        })
      } catch (error) {
        console.error('刷新 token 失敗:', error)
      }
    },

    // 登出
    async logout(context) {
      try {
        await membershipApi.logout()
      } catch (error) {
        console.error('登出API呼叫失敗')
      } finally {
        // 清除狀態
        context.commit('REMOVE_AUTH')

        // 清除 cookie
        Cookies.remove(TOKEN_KEY)
        Cookies.remove(USER_KEY)
      }
    },
  },
}
