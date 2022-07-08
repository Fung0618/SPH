// 这里写菜单的接口

import requests from '@/utils/request'

// 获取菜单列表 /admin/acl/permission get
export const getPermission = () => requests({url:'/admin/acl/permission',method:'get'})

// 根据角色获取菜单 /admin/acl/permission/toAssign/{roleId} get
export const getPermissionByRoleId = (roleId) => requests({url:`/admin/acl/permission/toAssign/${roleId}`,method:'get'})

// 根据角色分配菜单 /admin/acl/permission/doAssign post
export const doAssignByRoleId = (roleId,permissionId)=>requests({url:'/admin/acl/permission/doAssign',method:'post',params:{roleId,permissionId}})

// 删除菜单 /admin/acl/permission/remove/{id} delete
export const removePermission = (id) => requests({url:`/admin/acl/permission/remove/${id}`,method:'delete'})

// 新增或者修改菜单
// /admin/acl/permission/save post
// /admin/acl/permission/update put
export const addOrUpdatePermission = (data) => {
    if(data.id){
        // 修改
        return requests({url:'/admin/acl/permission/update',method:'put',data})
    }else{
        // 新增
        return requests({url:'/admin/acl/permission/save', method:'post',data})
    }
} 