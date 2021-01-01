import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Contact from '@/components/Contact'
import Personal from '@/components/Personal'
import Contribute from '@/components/Contribute'
import Upload from '@/components/Upload'
import MeetingDetail from '@/components/MeetingDetail'
import Admin from '@/components/Admin'
import ReadOver from '@/components/ReadOver'
import EditMyEssay from '@/components/EditMyEssay'

import store from '../store'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/contribute',
      name: 'Contribute',
      component: Contribute,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/meetingDetail',
      name: 'MeetingDetail',
      component: MeetingDetail,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        requireAuth: true
      },
    },
    {
      path: '/readOver',
      name: 'ReadOver',
      component: ReadOver,
      meta: {
        requireAuth: true
      },
    },
    {
      path: '/editMyEssay',
      name: 'EditMyEssay',
      component: EditMyEssay,
      meta: {
        requireAuth: true
      },
    }
  ]
})

// 前端登录拦截
router.beforeEach(function (to, from ,next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.token) {
      if(store.state.status === 'admin'){
        console.log("管理员")
        if(to.fullPath === '/admin'){next()}
        else{
          //console.log("无权限")
          next({
            path:'/admin'
          })
        }
      }
      else{
        console.log("普通用户")
        if(to.fullPath === '/admin'){
          //console.log("无权限")
          next({
            path:from.fullPath
          })
        }
        else{next()}
      }
    } else {
      next({
        path: '/login',
        query: {redirect:to.fullPath} // 登录成功之后重新跳转到该路由,将目的路由地址存入login的query中
      })
    }
  } else {
    next()
  }
})
