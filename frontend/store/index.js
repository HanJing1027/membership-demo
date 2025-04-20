import { createStore } from 'vuex'
import auth from './modules/auth'
import toast from './modules/toast'

export default createStore({
  modules: {
    auth,
    toast,
  },
})
