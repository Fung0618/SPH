// 这里写spu管理的接口

import spu from '@/store/modules/product/spu'
import requests from '@/utils/request'

// 获取Spu列表  /admin/product/{page}/{limit} method get
export const getSpuList = (page,limit,category3Id) => requests({url:`/admin/product/${page}/${limit}`,params:{category3Id},method:'get'})

// 删除Spu /admin/product/deleteSpu/{spuId} method delete
export const removeSpu = (spuId) => requests({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// 根据spuiId获取sku列表 /admin/product/findBySpuId/{spuId} method get
export const getSkuListBySpuId = (spuId) => requests({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})

// 根据spuId获取当前spu的图片列表 /admin/product/spuImageList/{spuId} method get
export const getSpuImgsBySpuId = (spuId) => requests({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 根据spuId获取当前spu的所有销售属性 /admin/product/spuSaleAttrList/{spuId} method get
export const getSpuSaleAttrListBySpuId = (spuId) => requests({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// 新增sku /admin/product/saveSkuInfo method post
export const saveSkuInfo = (data) => requests({url:'/admin/product/saveSkuInfo',method:'post',data})

// 获取平台所有的销售属性 /admin/product/baseSaleAttrList method get
export const getBaseSaleAttrList = () => requests({url:'/admin/product/baseSaleAttrList',method:'get'})

// 根据spuId获取spuInfo /admin/product/getSpuById/{spuId} method get
export const getSpuInfoBySpuId = (spuId) => requests({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// 获取平台的所有品牌 /admin/product/baseTrademark/getTrademarkList method get
export const getTrademarkList = () => requests({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'})

// 新增或者修改spu /admin/product/saveSpuInfo method post 
// /admin/product/updateSpuInfo  method post
export const addOrUpdateSpuInfo = (data) => {
    if(data.id){
        // 修改
        return requests({url:'/admin/product/updateSpuInfo',method:'post',data})
    }else{
        // 新增
        return requests({url:'/admin/product/saveSpuInfo',method:'post',data})
    }
}