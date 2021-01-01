import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {//响应式状态
    token: localStorage.getItem('token') || null,//若未定义则会返回undefined，||null则得到null
    userDetails: localStorage.getItem('userDetails') || null,
    status: localStorage.getItem('status') || null
  },
  mutations: {
    login(state,payload){
      localStorage.setItem('token', payload.data.token)
      localStorage.setItem('userDetails', payload.data.userDetails)
      state.userDetails = payload.data.userDetails
      state.token = payload.data.token
      if(payload.isAdmin){
        state.status = 'admin'
        localStorage.setItem('status', 'admin')
      }
      else{
        state.status = 'user'
        localStorage.setItem('status', 'user')
      }
    },
    logout(state) {
      // 移除token
      localStorage.removeItem('token')
      localStorage.removeItem('userDetails')
      state.userDetails = null
      state.token = null
      state.admin = false;
    }
  },
  actions: {
  }
})
