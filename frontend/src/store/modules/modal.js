export default {
  namespaced: true,

  state: () => ({
    modal: {
      show: false,
      title: '',
      content: '',
      buttonText: null,
      boxIcon: null,
      buttonAction: null,
      buttonCallback: null,
    },
  }),

  getters: {
    getModal: (state) => state.modal,
  },

  mutations: {
    SET_MODAL(state, modal) {
      state.modal = modal
    },
    HIDE_MODAL(state) {
      state.modal.show = false
    },
  },

  actions: {
    // 顯示 modal 並設置 狀態
    showModal(context, { title, content, buttonText, boxIcon, buttonAction, buttonCallback }) {
      context.commit('SET_MODAL', {
        show: true,
        title,
        content,
        buttonText,
        boxIcon,
        buttonAction,
        buttonCallback,
      })
    },

    // 關閉 modal
    hideModal(context) {
      context.commit('HIDE_MODAL')
    },

    // 擴展更多按鈕功能
    handleButtonAction(context, { action, callback }) {
      // 可以自訂義其他的行為邏輯
      if (typeof callback === 'function') {
        callback()
      }

      // 未來可以擴展更多的行為
      if (action === 'close') {
        // 關閉 modal
        context.dispatch('hideModal')
      }
    },
  },
}
