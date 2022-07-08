
// 这里写品牌管理的接口
// 引入二次封装好的axios的请求对象
import requests from '@/utils/request'

//获取品牌列表 /admin/product/baseTrademark/{page}/{limit} method get
export const getTrademarkList = (page,limit) => requests({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//根据id获取品牌 /admin/product/baseTrademark/get/{id} method get
export const getTrademarkById = (tradaId) => requests({url:`/admin/product/baseTrademark/get/${tradaId}`,method:'get'})

//新增或者修改品牌(该接口崩了，后面再试试)
// /admin/product/baseTrademark/save  method post 不携带id
// /admin/product/baseTrademark/update method post 携带id
export const addOrUpdateTrademark = (data) => {
    if(data.id){
        return requests({url:'/admin/product/baseTrademark/update',method:'put',data})
    }else{
        return requests({url:'/admin/product/baseTrademark/save',method:'post',data})
    }
}

// 删除品牌 /admin/product/baseTrademark/remove/{id} method delete
export const removeTrademark = (tradeId) => requests({url:`/admin/product/baseTrademark/remove/${tradeId}`,method:'delete'})