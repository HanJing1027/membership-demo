export default {
  namespaced: true,

  state: () => ({
    toast: {
      show: false,
      type: 'success',
      message: '',
    },
  }),

  getters: {
    getToast: (state) => state.toast,
  },

  mutations: {
    SET_TOAST(state, toast) {
      state.toast = toast
    },
    HIDDEN_TOAST(state) {
      state.toast.show = false
    },
  },

  actions: {
    showToast(context, { type, message }) {
      context.commit('SET_TOAST', {
        show: true,
        type: type,
        message: message,
      })

      setTimeout(() => {
        context.commit('HIDDEN_TOAST')
      }, 4000)
    },
  },
}
