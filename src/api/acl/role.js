// 这里写role模块的接口

import requests from '@/utils/request'

// 获取角色列表 /admin/acl/role/{page}/{limit} get
export const getRoleList = (page,limit,roleName='') => requests({url:`/admin/acl/role/${page}/${limit}`,method:'get',params:{roleName}})

// 删除role /admin/acl/role/remove/{id} delete
export const removeRole = (id) => requests({url:`/admin/acl/role/remove/${id}`,method:'delete'})

// 批量删除  /admin/acl/role/batchRemove  delete
export const banchRemove = (data) => requests({url:'/admin/acl/role/batchRemove',method:'delete',data})

// 新增与修改角色 
// /admin/acl/role/save post
// /admin/acl/role/update put
export const addOrUpdateRole = (data) => {
    if(data.id){
        // 修改
        return requests({url:'/admin/acl/role/update',method:'put',data})
    }else{
        // 新增
        return requests({url:'/admin/acl/role/save',method:'post',data})
    }
}