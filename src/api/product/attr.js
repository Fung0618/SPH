// 这里写属性管理平台的接口

import requests from '@/utils/request'

// 获取一级分类列表 /admin/product/getCategory1 method get
export const getCategory1List = () => requests({url:'/admin/product/getCategory1',method:'get'})

// 根据一级分类的id获取二级分类列表 /admin/product/getCategory2/{category1Id} method get
export const getCategory2List = (category1Id) => requests({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 根据二级分类得id获取三级分类列表 /admin/product/getCategory3/{category2Id} method  get
export const getCategory3List = (category2Id) => requests({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 根据一级二级三级分类id获取平台属性列表 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} method get
export const getAttrList = (category1Id,category2Id,category3Id) => requests({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 根据平台属性id移除平台属性  /admin/product/deleteAttr/{attrId} method delete
export const removeAttr = (attrId) => requests({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})

// 新增或者修改平台属性 /admin/product/saveAttrInfo method post
// 不带id就是新增 带了id就是修改
export const addOrUpdateAttr = (data) => requests({url:'/admin/product/saveAttrInfo',method:'post',data})