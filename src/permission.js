import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不需要token就可以去的白名单地址

router.beforeEach(async(to, from, next) => {
  //  启动进度条
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 从cookie中获取token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果有token并且手动跳去登录页，则重定向回主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果有token并且不是去登录页
      const hasGetUserInfo = store.getters.name
      // 获取用户信息
      if (hasGetUserInfo) { //如果有用户信息
        next()
      } else {  // 如有没有用户信息,则重新委派获取
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          next()
        } catch (error) { 
          // token过期，获取用户信息失败，移除token并且重新登录
          await store.dispatch('user/resetToken')
          // 这是js文件中使用element-ui的方式
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
