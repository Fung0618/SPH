// 这里写用户管理的接口

import requests from '@/utils/request'

// 获取用户列表 /admin/acl/user/{page}/{limit} method get
export const getUserList = (page, limit, keyword = '') => requests({ url: `/admin/acl/user/${page}/${limit}`, method: 'get', params: { username: keyword } })

// 删除user根据userId /admin/acl/user/remove/{id} method delete
export const removeUserById = (id) => requests({ url: `/admin/acl/user/remove/${id}`, method: 'delete' })

// 批量删除user /admin/acl/user/batchRemove method delete
export const banchRemove = (data) => requests({ url: '/admin/acl/user/batchRemove', method: 'delete', data })

// 根据userId或者全部权限列表以及 当前用户分类的权限 /admin/acl/user/toAssign/{userId} method get
export const getAssignByUserId = (userId) => requests({ url: `/admin/acl/user/toAssign/${userId}`, method: 'get' })

// 新增以及修改用户
// /admin/acl/user/save  post
// /admin/acl/user/update put
export const addOrUpdateUser = (data) => {
    if(data.id){
        // 修改
        return requests({url:'/admin/acl/user/update',method:'put',data})
    }else{
        return requests({url:'/admin/acl/user/save',method:'post',data})
    }
}

//  分配角色 /admin/acl/user/doAssign post 
export const toAssignUser = (params) => requests({url:'/admin/acl/user/doAssign',method:'post',params}) 





