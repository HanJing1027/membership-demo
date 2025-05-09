import { createStore } from 'vuex'
import auth from './modules/auth.js'
import toast from './modules/toast.js'
import modal from './modules/modal.js'

export default createStore({
  modules: {
    auth,
    toast,
    modal,
  },
})
