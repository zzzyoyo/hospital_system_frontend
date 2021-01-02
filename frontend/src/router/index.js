import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Doctor from '@/components/Doctor'
import HeadNurse from '@/components/HeadNurse'
import WardNurse from '@/components/WardNurse'
import EmergencyNurse from '@/components/EmergencyNurse'
import NucleicAcidTestSheet from '@/components/NucleicAcidTestSheet'
import DailyStatusRecord from '@/components/DailyStatusRecord'

import store from '../store'

Vue.use(Router);

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
      component: Login,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/doctor',
      name: 'Doctor',
      component: Doctor,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/wardNurse',
      name: 'WardNurse',
      component: WardNurse,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/headNurse',
      name: 'HeadNurse',
      component: HeadNurse,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/emergencyNurse',
      name: 'EmergencyNurse',
      component: EmergencyNurse,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/test_sheet',
      name: 'NucleicAcidTestSheet',
      component: NucleicAcidTestSheet,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/state_record',
      name: 'DailyStatusRecord',
      component: DailyStatusRecord,
      meta: {
        requireAuth: true
      }
    }
  ]
});

// 前端登录拦截
router.beforeEach(function (to, from ,next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (store.state.token) {
      if(to.fullPath === '/test_sheet' || to.fullPath === '/state_record'){
        //只需要登录权限，不管是哪个角色都可以访问
        next();
        return;
      }
      //不同角色的访问权限不同
      switch (store.state.role) {
        case 'doctor':
          if(to.fullPath === '/doctor'){next()}
          else {
            alert("无权限");
            next({
              path:'/doctor'
            });
          }
          break;
        case 'headNurse':
          if(to.fullPath === '/headNurse'){next()}
          else {
            alert("无权限");
            next({
              path:'/headNurse'
            });
          }
          break;
        case 'wardNurse':
          if(to.fullPath === '/wardNurse'){next()}
          else {
            alert("无权限");
            next({
              path:'/wardNurse'
            });
          }
          break;
        case 'emergencyNurse':
          if(to.fullPath === '/emergencyNurse'){next()}
          else {
            alert("无权限");
            next({
              path:'/emergencyNurse'
            });
          }
          break;
        default:
          next({path:'/'});
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
});
