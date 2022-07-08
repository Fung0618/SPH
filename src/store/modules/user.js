import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [],
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTONS:(state,buttons) => {
    state.buttons = buttons
  },
  SET_ROUTES:(state,routes) => {
    state.routes = routes
  }
}

const actions = {
  // 用户登录的actions
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token) //委派mutations修改state中的token
      setToken(result.data.token) // 本地缓存token
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

// 获取用户信息
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    if (result.code == 20000) {
      //  获取用户信息成功
      const { data } = result
      console.log(result)
      if (!data) {
        // token过期，即使请求成功也不会返回data,会返回undefined或者null
        return Promise.reject(new Error('token is timeout, please re-login again'))
      }
      const { name, avatar, buttons, routes } = data
      commit('SET_NAME', name) // 保存用户名信息
      commit('SET_AVATAR', avatar) // 保存头像信息
      commit('SET_BUTTONS',buttons) // 保存权限按钮信息
      commit('SET_ROUTES',routes) //保存权限路由信息  
      return data
    }else{
      // 获取用户信息失败
      return Promise.reject(new Error('faile to get userInfo,please re-login again'))
    }
  },

  // 退出登录
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code == 20000) {
      removeToken() // 一定要移除Cookie中的token
      resetRouter()  // 重置路由 因为每次登录的角色不同，路由也会不同
      commit('RESET_STATE') // 移除state中的token
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

