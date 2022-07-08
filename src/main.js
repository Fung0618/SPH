import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限管理

// 引入Hintbutton为全局组件
import Hintbutton from '@/components/Hintbutton'
// 引入三级分类为全局组件
import CategoryList from '@/components/CategoryList'
// 引入product模块所有的接口
import API from '@/api'

Vue.component(Hintbutton.name,Hintbutton)
Vue.component(CategoryList.name,CategoryList)
// 将项目的接口放在Vue的原型上供全部组件使用
Vue.prototype.$API = API


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  beforeCreate(){
    // 注册全局事件总线
    Vue.prototype.$bus = this
  },
  render: h => h(App)
})
