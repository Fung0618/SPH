// 这里配置spu模块的仓库
import API from '@/api/product'

const state = {
    spuImgList: [],
    spuSaleAttrList: [],
    attrList: [],
    trademarkList: [],
    baseSaleAttrList: [],
    currentSpuInfo: {}
}

const mutations = {
    GETSPUIMGS(state,result){
        state.spuImgList = result.data
    },
    GETSPUSALEATTRLIST(state,result){
        state.spuSaleAttrList = result.data
    },
    GETATTRLIST(state,result){
        state.attrList = result.data
    },
    GETTRADEMARKLIST(state,result){
        state.trademarkList = result.data
    },
    GETBASESALEATTRLIST(state,result){
        state.baseSaleAttrList = result.data
    },
    GETSPUINFOBYSPUID(state,result){
        state.currentSpuInfo = result.data
    }
}

const actions = {
    // 获取spuImgList
   async getSpuImgs({commit},row){
      let result = await API.spu.getSpuImgsBySpuId(row.id)
      if(result.code == 200){
          commit('GETSPUIMGS',result)
          return 'ok'
      }else{
          return Promise.reject(new Error('失败'))
      }
    },
    // 获取spuSaleAttrList
   async getSpuSaleAttrList({commit},row){
     let result = await API.spu.getSpuSaleAttrListBySpuId(row.id)
     if(result.code == 200){
        commit('GETSPUSALEATTRLIST',result)
        return 'ok'
     }else{
         return Promise.reject(new Error('faile'))
     }
    },
    // 获取改三级分类下的所有平台属性
   async getAttrList({commit},categoryIds){
     let {category1Id,category2Id,category3Id} =  categoryIds
     let result = await API.attr.getAttrList(category1Id,category2Id,category3Id)
     if(result.code == 200){
         commit('GETATTRLIST',result)
         return 'ok'
     }else{
        return Promise.reject(new Error('faile'))
     }
    },
    // 获取平台下的所有品牌
   async getTrademarkList({commit}){
       let result = await API.spu.getTrademarkList()
       if(result.code == 200){
           commit('GETTRADEMARKLIST',result)
           return 'ok'
       }else{
           return Promise.reject(new Error('faile'))
       }
    },
    // 获取平台所有的销售属性
   async getBaseSaleAttrList({commit}){
       let result = await API.spu.getBaseSaleAttrList()
       if(result.code == 200){
           commit('GETBASESALEATTRLIST',result)
           return 'ok'
       }else{
           return Promise.reject(new Error('faile'))
       }
    },
    // 根据spuId获取currentSpuInfo
   async getSpuInfoBySpuId({commit},spuId){
      let result =  await API.spu.getSpuInfoBySpuId(spuId)
      if(result.code == 200){
          commit('GETSPUINFOBYSPUID',result)
          return 'ok'
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