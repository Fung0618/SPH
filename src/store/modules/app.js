import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // Cookies.get('sidebarStatus') 非空串 非0 非undefined 非null 非NaN 非false的情况时候走情况一
    // 情况一： !!+Cookies.get('sidebarStatus') 如果Cookies.get('sidebarStatus')是数字或者数字字符串时true其余为false
    // 情况二： true
    // 这里仓库中的sidebar的opened会在没有被委派的时候就开始去Cookies或者值，获取到的肯定是空值，所以一上来是默认为true
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false //默认没有动画
  },
  device: 'desktop'
}

const mutations = {
  // 第一次执行的时候，sidebar.opened的值是true
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      // 这里是第一次我们将侧壁栏从展开变为压缩的时候会执行的代码，先设置0
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
