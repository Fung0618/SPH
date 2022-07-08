// 这里是home的仓库
import API from '@/api'
const state = {
     homeData: {}
}

const mutations = {
    GETHOMEDATA(state,result){
        state.homeData = result.data
    }
}

const actions = {
  async getHomeData({commit}){
   let result = await API.home.dashboard.getHomeData()
    if(result.code == 20000){
       commit('GETHOMEDATA',result)
       return  'ok'
    }else{
        return Promise.reject(new Error('faile'))
    }
   }
}

export default {
    namespaced:true,//开启命名空间
    state,
    mutations,
    actions
}