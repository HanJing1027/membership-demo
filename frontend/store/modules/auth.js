export default {
  namespaced: true,

  state: () => ({
    user: null,
    token: null,
    // token: 'test-token',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // 強制轉為布林值進行判斷
    currentUser: (state) => state.user,
  },
}
