// 这里写sku管理的接口
import requests from '@/utils/request'

//获取sku列表 /admin/product/list/{page}/{limit}  method get
export const getSkuList  = (page,limit) =>requests({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//上架   /admin/product/onSale/{skuId} method get
export const onSale = (skuId) => requests({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 下架 /admin/product/cancelSale/{skuId} method get
export const cancelSale = (skuId) => requests({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 根据skuId获取skuInfo /admin/product/getSkuById/{skuId} method get
export const getSkuInfoBySkuId = (skuId) => requests({url:`/admin/product/getSkuById/${skuId}`,method:'get'})

// 删除sku /admin/product/deleteSku/{skuId} method delete
export const removeSkuBySkuId = (skuId) => requests({url:`/admin/product/deleteSku/${skuId}`,method:'delete'})
