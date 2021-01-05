// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//import 'bootstrap/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min'


Vue.use(ElementUI)

//axios 配置
var axios = require('axios')
// Axios挂载到prototype，全局可以使用this.$axios访问
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8"

Vue.config.productionTip = false

// http request 拦截器
axios.interceptors.request.use(
  config => {
    console.log(config.data);
    if(store.state.token) {
      // 判断是否有token，若存在，每个http header加上token
      config.headers.Authorization = 'Bearer:'+store.state.token;
    }
    //console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log("response 拦截器")
    if(error.response){
      if(error.response.status === 555){
        //token过期
        console.log('token过期')
        store.commit('logout')
        router.currentRoute.path !== '/login' &&
        router.currentRoute.path !== '/register' &&
        router.replace({
          path:'/login',
          query: { redirect: router.currentRoute.path }
        })
      }
      else if(error.response.status === 666){
        alert('无权限')
        store.commit('logout')
        router.replace({
          path:'/login',
          query: { redirect: router.currentRoute.path }
        })
      }
    }
    console.log(error.response)
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
