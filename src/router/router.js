import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routerMap } from './router.config.js'

Vue.use(Router)

const router = new Router({
  // mode: 'hash', // 默认是 history 可以改为 hash
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})

// 全局路由守卫
const userAgent = navigator.userAgent
const isIE = userAgent.indexOf('Trident') > -1

router.beforeEach((to, from, next) => {
  if (to.path === '/exception/browser') {
    next()
  } else {
    if (isIE) {
      next({ path: '/exception/browser' })
    } else {
      if (to.path === '/user/login' || to.path === '/user/register' || to.path === '/user/retrieve') {
        next()
      } else {
        if (localStorage.getItem('ACCESS_TOKEN')) {
          NProgress.start()
          next(Error)
        } else {
          next({ path: '/user/login' })
          localStorage.removeItem('ACCESS_TOKEN')
        }
      }
    }
  }
})

// 错误捕获
router.onError((error) => {
  console.log(error)
  const targetPath = router.history.pending.fullPath
  if (error) {
    console.log(1)
    window.location.reload(true)
    router.replace(targetPath)
  }
})

router.afterEach((from) => {
  NProgress.done()
})

export default router
