import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      statuscode: 0,
      cartCount: 0
  },
  mutations: {
      isLogin(state, value) {
        state.statuscode = value
      },
      cartNum(state, number) {
        state.cartCount = state.cartCount + number
      },
      init(state, number) {
        state.cartCount = number
      }
  },
  actions: {
      
    }
})