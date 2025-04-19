import Cookies from 'js-cookie'

// cookie 設定
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const TOKEN_DEATHLINE = 2 // cookie 默認失效天數

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
    login(context, { token, username, expiresIn }) {
      context.commit('SET_TOKEN', token)
      context.commit('SET_USER', username)

      // 將分鐘轉換為天數
      const expiresDays = expiresIn ? expiresIn / 1440 : TOKEN_DEATHLINE

      // 設定 cookie
      Cookies.set(TOKEN_KEY, token, {
        // secure: true, 開發用不到，部署到 HTTPS 再開啟
        expires: expiresDays,
        sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
      })
      Cookies.set(USER_KEY, username, {
        // secure: true, 開發用不到，部署到 HTTPS 再開啟
        expires: expiresDays,
        sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
      })
    },

    // 初始化狀態 (從 cookie 取出 token)
    initAuth(context) {
      const token = Cookies.get(TOKEN_KEY)
      const username = Cookies.get(USER_KEY)

      context.commit('SET_TOKEN', token)
      context.commit('SET_USER', username)
    },

    // 登出
    logout(context) {
      // 清除狀態
      context.commit('REMOVE_AUTH')

      // 清除 cookie
      Cookies.remove(TOKEN_KEY)
      Cookies.remove(USER_KEY)
    },
  },
}
